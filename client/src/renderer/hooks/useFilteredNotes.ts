import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ArchiveState, SortBy } from '../actions/userInterface';
import { NotesForListQuery } from '../generated/graphql';
import { RootState } from '../reducers';
import { UserInterfaceStateType } from '../reducers/userInterface';
import {
  DataState,
  UseDataStateLazyQuery,
  UseDataStateResult,
} from '../utils/useDataState';

const textIncludes = (needle?: string, haystack?: string): boolean => {
  if (!haystack || !needle) {
    return false;
  }

  return haystack.toLowerCase().includes(needle.toLowerCase());
};

interface FilteredNotes {
  notes: NotesForListQuery['notes'];
  archivedCount: number | undefined;
}
const filterNotes = (
  notes: NotesForListQuery['notes'],
  searchQuery: string,
  archiveState: ArchiveState
): FilteredNotes => {
  let filteredNotes = notes.filter((note) => !note.deletedAt);
  if (searchQuery.length !== 0) {
    filteredNotes = filteredNotes.filter(
      (note) =>
        ('url' in note && textIncludes(searchQuery, note.url)) ||
        textIncludes(searchQuery, note.name) ||
        note.tags.some((tag) => textIncludes(searchQuery, tag.name))
    );
  }

  const completeCount = filteredNotes.length;
  let archivedCount;

  if (archiveState === ArchiveState.ONLY_ARCHIVE) {
    filteredNotes = filteredNotes.filter((note) => Boolean(note.archivedAt));
    archivedCount = notes.length;
  } else if (archiveState === ArchiveState.NO_ARCHIVE) {
    filteredNotes = filteredNotes.filter((note) => !note.archivedAt);
    archivedCount = completeCount - filteredNotes.length;
  }

  return {
    notes: filteredNotes,
    archivedCount,
  };
};

export type FilteredNotesAndAllNotes = FilteredNotes & {
  allNotes: NotesForListQuery['notes'];
};

const sortByToFieldName: {
  [sortBy in SortBy]: keyof NotesForListQuery['notes'][number];
} = {
  [SortBy.CREATED_AT]: 'createdAt',
  [SortBy.UPDATED_AT]: 'updatedAt',
};

const extendedCache: {
  notesData: NotesForListQuery['notes'] | null;
  sortedNotes: NotesForListQuery['notes'] | null;
  filteredNotes: FilteredNotes | null;
  searchQuery: string | null;
  archiveState: ArchiveState | null;
  sortBy: SortBy | null;
} = {
  notesData: null,
  sortedNotes: null,
  filteredNotes: null,
  searchQuery: null,
  archiveState: null,
  sortBy: null,
};

const useFilteredNotes = (
  notesQuery: UseDataStateLazyQuery<NotesForListQuery, undefined>
): UseDataStateResult<
  FilteredNotesAndAllNotes,
  undefined,
  NotesForListQuery
> => {
  const { archiveState, sortBy, searchQuery } = useSelector<
    RootState,
    UserInterfaceStateType
  >((state) => state.userInterface);

  const [isFilteringNotes, setIsFilteringNotes] = useState(false);
  const [filteredNotes, setFilteredNotes] =
    useState<null | FilteredNotesAndAllNotes>(null);
  const timeoutRef = useRef<null | NodeJS.Timeout>(null);
  const allNotes = useMemo<NotesForListQuery['notes'] | null>(() => {
    if (notesQuery.state !== DataState.DATA) {
      return null;
    }

    if (
      notesQuery.data.notes === extendedCache.notesData &&
      sortBy === extendedCache.sortBy
    ) {
      return extendedCache.sortedNotes;
    }
    extendedCache.sortBy = sortBy;
    extendedCache.notesData = notesQuery.data.notes;

    const notes = [...notesQuery.data.notes]; // unfreeze
    notes.sort(
      (noteA, noteB) =>
        noteB[sortByToFieldName[sortBy]] - noteA[sortByToFieldName[sortBy]]
    );
    return notes;
  }, ['data' in notesQuery && notesQuery.data, sortBy]);

  useEffect(() => {
    if (!allNotes) {
      return;
    }

    if (
      allNotes === extendedCache.sortedNotes &&
      searchQuery === extendedCache.searchQuery &&
      archiveState === extendedCache.archiveState &&
      extendedCache.filteredNotes !== null
    ) {
      setFilteredNotes({ allNotes, ...extendedCache.filteredNotes });
      return;
    }
    extendedCache.sortedNotes = allNotes;
    extendedCache.searchQuery = searchQuery;
    extendedCache.archiveState = archiveState;

    setIsFilteringNotes(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(
      () => {
        const filteredNotes = filterNotes(allNotes, searchQuery, archiveState);
        extendedCache.filteredNotes = filteredNotes;
        setFilteredNotes({
          allNotes,
          ...filteredNotes,
        });
        setIsFilteringNotes(false);
      },
      searchQuery.length ? 100 : 0
    );
  }, [
    allNotes,
    searchQuery,
    archiveState,
    setIsFilteringNotes,
    setFilteredNotes,
  ]);

  if (notesQuery.state === DataState.UNCALLED) {
    return { ...notesQuery, state: DataState.LOADING };
  }
  if (notesQuery.state !== DataState.DATA) {
    return notesQuery;
  }

  if (!filteredNotes) {
    return { ...notesQuery, state: DataState.LOADING };
  }

  return {
    ...notesQuery,
    data: filteredNotes,
    loadingBackground: isFilteringNotes,
  };
};

export default useFilteredNotes;
