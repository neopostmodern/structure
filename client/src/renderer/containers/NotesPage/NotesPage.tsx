import { gql } from '@apollo/client'
import { CloudOff } from '@mui/icons-material'
import { CircularProgress, Stack, Typography } from '@mui/material'
import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { LinkLayout } from '../../actions/userInterface'
import Centered from '../../components/Centered'
import FatalApolloError from '../../components/FatalApolloError'
import Gap from '../../components/Gap'
import NetworkOperationsIndicator, {
  NetworkIndicatorContainer,
} from '../../components/NetworkOperationsIndicator'
import NoteBatchEditingBar from '../../components/NoteBatchEditingBar'
import NotesList from '../../components/NotesList'
import NotesMenu from '../../components/NotesMenu'
import NotesPageEmpty from '../../components/NotesPageEmpty'
import { SkeletonNoteList } from '../../components/Skeletons'
import useEntitiesUpdatedSince from '../../hooks/useEntitiesUpdatedSince'
import useIsOnline from '../../hooks/useIsOnline'
import useShortcut from '../../hooks/useShortcut'
import { RootState } from '../../reducers'
import { SHORTCUTS } from '../../utils/keyboard'
import {
  BASE_NOTE_FRAGMENT,
  BASE_TAG_FRAGMENT,
} from '../../utils/sharedQueriesAndFragments'
import { DataState, OFFLINE_CACHE_MISS } from '../../utils/useDataState'
import ComplexLayout from '../ComplexLayout'

export const NOTES_QUERY = gql`
  query NotesForList {
    notes {
      ...BaseNote

      ... on INote {
        tags {
          ...BaseTag
        }
      }
    }
  }
  ${BASE_NOTE_FRAGMENT}
  ${BASE_TAG_FRAGMENT}
`

const NotesPage: React.FC = () => {
  const layout = useSelector<RootState, LinkLayout>(
    (state) => state.userInterface.linkLayout,
  )

  const searchInput = useRef<HTMLInputElement | null>(null)

  const sortedNoteIds = useMemo(() => {
    if (notesCacheQuery.dataState !== 'complete') {
      return 'loading'
    }

    // todo: it seems with the query like above it should be okay to do filtering here instead of in the notes?

    let noteIds = [...notesCacheQuery.data.notes]

    noteIds.sort((a, b) => b.updatedAt - a.updatedAt)
    return noteIds
  }, [notesCacheQuery])

  const sortedAndFilteredNoteIds = useMemo(() => {
    if (skipSearch) {
      return sortedNoteIds
    }

    const matchedTags = tagsCacheQuery.data.tags
      .filter((tag) => tag.name.includes(searchQuery))
      .map(({ _id }) => _id)
    return sortedNoteIds.filter(
      (note) =>
        note.name.includes(searchQuery) ||
        note.tags.some((tag) => matchedTags.includes(tag._id)),
    )
  }, [sortedNoteIds, tagsCacheQuery.data, searchQuery])

  const entitiesUpdatedSince = useEntitiesUpdatedSince()
  useShortcut(SHORTCUTS.REFRESH, () => {
    entitiesUpdatedSince.refetch()
  })

  useShortcut(SHORTCUTS.SEARCH, () => {
    searchInput.current?.focus()
    setTimeout(
      () =>
        searchInput.current?.setSelectionRange(
          0,
          searchInput.current?.value.length,
        ),
      10,
    )
  })

  const isOnline = useIsOnline()

  const content = []
  let primaryActions = null

  if (cachedFilteredNotesQueryWrapper.state === DataState.ERROR) {
    if (
      cachedFilteredNotesQueryWrapper.error.extraInfo === OFFLINE_CACHE_MISS &&
      (entitiesUpdatedSince.state === DataState.UNCALLED ||
        entitiesUpdatedSince.state === DataState.LOADING)
    ) {
      content.push(
        <Centered key='first-load'>
          <Stack alignItems='center'>
            {isOnline ? (
              <>
                <CircularProgress color='inherit' disableShrink />
                <Gap vertical={1} />
                <Typography variant='caption'>
                  Loading notes for the first time, this might take a while...
                </Typography>
              </>
            ) : (
              <>
                <CloudOff sx={{ fontSize: '4rem', color: 'gray' }} />
                <Gap vertical={1} />
                <Typography variant='caption' textAlign='center'>
                  Your notes are not cached yet and can't be loaded at the
                  moment because you're offline.
                  <br /> Please try again later.
                </Typography>
              </>
            )}
          </Stack>
        </Centered>,
      )
    } else {
      content.push(
        <FatalApolloError
          key='error'
          query={cachedFilteredNotesQueryWrapper}
        />,
      )
    }
  } else if (cachedFilteredNotesQueryWrapper.state === DataState.DATA) {
    if (cachedFilteredNotesQueryWrapper.loadingBackground) {
      content.push(
        <NetworkIndicatorContainer key='searching' align='left'>
          Filtering...
        </NetworkIndicatorContainer>,
      )
    }

    const {
      allNotes,
      notes: matchedNotes,
      archivedCount: archivedMatchedNotesCount,
    } = cachedFilteredNotesQueryWrapper.data

    content.push(
      <NoteBatchEditingBar key='batch-operations-menu' notes={matchedNotes} />,
    )

    content.push(
      <NetworkOperationsIndicator
        key='refresh-indicator'
        query={entitiesUpdatedSince}
      />,
    )

    if (
      matchedNotes.length === 0 &&
      notesQuery.state === DataState.DATA &&
      notesQuery.data.notes.length > 0
    ) {
      content.push(
        <NotesPageEmpty
          key='empty-search-filter'
          archivedMatchedNotesCount={archivedMatchedNotesCount}
        />,
      )
    } else {
      content.push(
        <NotesList
          key='notes-list'
          noteIds={matchedNotes}
          expanded={layout === LinkLayout.EXPANDED_LIST_LAYOUT}
          initialCount={15}
        />,
      )
    }

    primaryActions = (
      <NotesMenu
        matchedNotes={matchedNotes}
        notes={allNotes}
        searchInput={searchInput}
        archivedMatchedNotesCount={archivedMatchedNotesCount}
      />
    )
  }

  return (
    <ComplexLayout
      primaryActions={primaryActions}
      loading={cachedFilteredNotesQueryWrapper.state === DataState.LOADING}
      loadingComponent={SkeletonNoteList}
    >
      {[...content]}
    </ComplexLayout>
  )
}

export default NotesPage
