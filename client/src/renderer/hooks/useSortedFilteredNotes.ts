import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { ArchiveState, SortBy } from '../actions/userInterface'
import type {
  NotesForSortAndFilterQuery,
  TagsForSearchQuery,
} from '../generated/graphql'
import { RootState } from '../reducers'
import { DataState, PolicedData } from '../utils/useDataState'

const textIncludes = (needle?: string, haystack?: string): boolean => {
  if (!haystack || !needle) {
    return false
  }

  return haystack.toLowerCase().includes(needle.toLowerCase())
}

interface FilteredNotes {
  notes: NotesForSortAndFilterQuery['notes']
  archivedCount: number | undefined
}
const filterNotes = (
  notes: NotesForSortAndFilterQuery['notes'],
  searchQuery: string,
  archiveState: ArchiveState,
  tagsCacheQuery: useQuery.Result<TagsForSearchQuery>,
): FilteredNotes => {
  let filteredNotes = notes.filter((note) => !note.deletedAt)
  if (searchQuery.length !== 0) {
    if (tagsCacheQuery.dataState !== 'complete') {
      throw new Error(
        '[useSortedFilteredNotes] Illegal state: tags not loaded from cache.',
      )
    }

    const matchedTagIds = tagsCacheQuery.data.tags
      .filter((tag) => textIncludes(searchQuery, tag.name))
      .map(({ _id }) => _id)

    filteredNotes = filteredNotes.filter(
      (note) =>
        ('url' in note && textIncludes(searchQuery, note.url)) ||
        textIncludes(searchQuery, note.name) ||
        note.tags.some((tag) => matchedTagIds.includes(tag._id)),
    )
  }

  const completeCount = filteredNotes.length
  let archivedCount

  if (archiveState === ArchiveState.ONLY_ARCHIVE) {
    filteredNotes = filteredNotes.filter((note) => Boolean(note.archivedAt))
    archivedCount = notes.length
  } else if (archiveState === ArchiveState.NO_ARCHIVE) {
    filteredNotes = filteredNotes.filter((note) => !note.archivedAt)
    archivedCount = completeCount - filteredNotes.length
  }

  return {
    notes: filteredNotes,
    archivedCount,
  }
}

export type FilteredNotesAndAllNotes = FilteredNotes & {
  allNotes: NotesForSortAndFilterQuery['notes']
}

const sortByToFieldName: {
  [sortBy in SortBy]: keyof NotesForSortAndFilterQuery['notes'][number]
} = {
  [SortBy.CREATED_AT]: 'createdAt',
  [SortBy.UPDATED_AT]: 'updatedAt',
  [SortBy.CHANGED_AT]: 'changedAt',
}

const extendedCache: {
  notesData: NotesForSortAndFilterQuery['notes'] | null
  sortedNotes: NotesForSortAndFilterQuery['notes'] | null
  filteredNotes: FilteredNotes | null
  searchQuery: string | null
  archiveState: ArchiveState | null
  sortBy: SortBy | null
} = {
  notesData: null,
  sortedNotes: null,
  filteredNotes: null,
  searchQuery: null,
  archiveState: null,
  sortBy: null,
}

const useSortedFilteredNotes = (): PolicedData<FilteredNotesAndAllNotes> => {
  const archiveState = useSelector<RootState, ArchiveState>(
    (state) => state.userInterface.archiveState,
  )
  const sortBy = useSelector<RootState, SortBy>(
    (state) => state.userInterface.sortBy,
  )
  const searchQuery = useSelector<RootState, string>(
    (state) => state.userInterface.searchQuery,
  )
  const skipSearch = !searchQuery

  const notesCacheQuery = useQuery<NotesForSortAndFilterQuery>(
    gql`
      query NotesForSortAndFilter {
        notes {
          ... on INote {
            _id
            createdAt
            updatedAt
            changedAt
            archivedAt
            name
            tags {
              _id
            }
          }
          ... on Link {
            url
          }
        }
      }
    `,
    {
      fetchPolicy: 'cache-only',
    },
  )

  const tagsCacheQuery = useQuery<TagsForSearchQuery>(
    gql`
      query TagsForSearch {
        tags {
          _id
          name
        }
      }
    `,
    { fetchPolicy: 'cache-only', skip: skipSearch },
  )

  const allNotesSorted = useMemo<
    NotesForSortAndFilterQuery['notes'] | null
  >(() => {
    if (notesCacheQuery.dataState !== 'complete') {
      return null
    }

    if (
      notesCacheQuery.data.notes === extendedCache.notesData &&
      sortBy === extendedCache.sortBy
    ) {
      return extendedCache.sortedNotes
    }
    extendedCache.sortBy = sortBy
    extendedCache.notesData = notesCacheQuery.data.notes

    const notes = [...notesCacheQuery.data.notes] // unfreeze
    notes.sort(
      (noteA, noteB) =>
        noteB[sortByToFieldName[sortBy]] - noteA[sortByToFieldName[sortBy]],
    )
    return notes
  }, [notesCacheQuery.data, sortBy])

  if (!allNotesSorted) {
    return { state: DataState.LOADING }
  }

  if (
    allNotesSorted !== extendedCache.sortedNotes ||
    searchQuery !== extendedCache.searchQuery ||
    archiveState !== extendedCache.archiveState ||
    extendedCache.filteredNotes === null
  ) {
    extendedCache.sortedNotes = allNotesSorted
    extendedCache.searchQuery = searchQuery
    extendedCache.archiveState = archiveState

    extendedCache.filteredNotes = filterNotes(
      allNotesSorted,
      searchQuery,
      archiveState,
      tagsCacheQuery,
    )
  }

  return {
    state: DataState.DATA,
    data: {
      ...extendedCache.filteredNotes,
      allNotes: allNotesSorted,
    },
    loadingBackground: false,
  }
}

export default useSortedFilteredNotes
