import { gql } from '@apollo/client'
import { CloudOff } from '@mui/icons-material'
import { CircularProgress, Stack, Typography } from '@mui/material'
import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { LinkLayout } from '../actions/userInterface'
import Centered from '../components/Centered'
import FatalApolloError from '../components/FatalApolloError'
import Gap from '../components/Gap'
import NetworkOperationsIndicator, {
  NetworkIndicatorContainer,
} from '../components/NetworkOperationsIndicator'
import NoteBatchEditingBar from '../components/NoteBatchEditingBar'
import NotesList from '../components/NotesList'
import NotesMenu from '../components/NotesMenu'
import NotesPageEmpty from '../components/NotesPageEmpty'
import { SkeletonNoteList } from '../components/Skeletons'
import useEntitiesUpdatedSince from '../hooks/useEntitiesUpdatedSince'
import useIsOnline from '../hooks/useIsOnline'
import useShortcut from '../hooks/useShortcut'
import useSortedFilteredNotes from '../hooks/useSortedFilteredNotes'
import { RootState } from '../reducers'
import { SHORTCUTS } from '../utils/keyboard'
import noteCountsWithSearchMatchesString from '../utils/noteCountsWithSearchMatchesString'
import {
  BASE_NOTE_FRAGMENT,
  BASE_TAG_FRAGMENT,
} from '../utils/sharedQueriesAndFragments'
import { DataState, OFFLINE_CACHE_MISS } from '../utils/useDataState'
import ComplexLayout from './ComplexLayout'

export const OPTIMISTIC_NOTE_COUNT = 15

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
  console.log('notes page')
  const layout = useSelector<RootState, LinkLayout>(
    (state) => state.userInterface.linkLayout,
  )
  const archiveState = useSelector<RootState, LinkLayout>(
    (state) => state.userInterface.archiveState,
  )

  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const cachedFilteredNotesPseudoQuery = useSortedFilteredNotes()

  const entitiesUpdatedSince = useEntitiesUpdatedSince()
  useShortcut(SHORTCUTS.REFRESH, () => {
    entitiesUpdatedSince.refetch()
  })

  useShortcut(SHORTCUTS.SEARCH, () => {
    searchInputRef.current?.focus()
    setTimeout(
      () =>
        searchInputRef.current?.setSelectionRange(
          0,
          searchInputRef.current?.value.length,
        ),
      10,
    )
  })

  const isOnline = useIsOnline()

  const content = []
  let primaryActions = null

  if (cachedFilteredNotesPseudoQuery.state === DataState.ERROR) {
    if (
      cachedFilteredNotesPseudoQuery.error.extraInfo === OFFLINE_CACHE_MISS &&
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
        <FatalApolloError key='error' query={cachedFilteredNotesPseudoQuery} />,
      )
    }
  } else if (cachedFilteredNotesPseudoQuery.state === DataState.DATA) {
    if (cachedFilteredNotesPseudoQuery.loadingBackground) {
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
    } = cachedFilteredNotesPseudoQuery.data

    content.push(
      <NoteBatchEditingBar key='batch-operations-menu' notes={matchedNotes} />,
    )

    content.push(
      <NetworkOperationsIndicator
        key='refresh-indicator'
        query={entitiesUpdatedSince}
      />,
    )

    if (matchedNotes.length === 0 && allNotes.length > 0) {
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
          noteIds={matchedNotes.map(({ _id }) => _id)}
          expanded={layout === LinkLayout.EXPANDED_LIST_LAYOUT}
          initialCount={OPTIMISTIC_NOTE_COUNT}
        />,
      )
    }

    primaryActions = (
      <NotesMenu
        noteCountsWithSearchMatchesString={noteCountsWithSearchMatchesString({
          notes: allNotes,
          matchedNotes: matchedNotes,
          archiveState,
          archivedMatchedNotesCount,
        })}
        searchInputRef={searchInputRef}
      />
    )
  }

  return (
    <ComplexLayout
      primaryActions={primaryActions}
      loading={cachedFilteredNotesPseudoQuery.state === DataState.LOADING}
      loadingComponent={SkeletonNoteList}
    >
      {[...content]}
    </ComplexLayout>
  )
}

export default NotesPage
