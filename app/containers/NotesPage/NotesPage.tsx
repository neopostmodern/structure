import React, { useEffect, useRef } from 'react'
import { gql, useQuery } from '@apollo/client'
import { useDispatch, useSelector } from 'react-redux'
import Mousetrap from 'mousetrap'
import styled from 'styled-components'

import NotesList from '../../components/NotesList'
import {
  ArchiveState,
  changeArchiveState,
  changeLinkLayout,
  changeSearchQuery,
  increaseInfiniteScroll,
  LinkLayout,
  setBatchSelected,
  setBatchSelection,
  toggleBatchEditing,
} from '../../actions/userInterface'
import {
  BatchSelectionType,
  UserInterfaceStateType,
} from '../../reducers/userInterface'

import Centered from '../../components/Centered'
import NotesMenu from '../../components/NotesMenu'
import { StickyMenu } from '../../components/Menu'
import { NotesForList } from '../../generated/NotesForList'
import { RootState } from '../../reducers'

import NetworkError from '../../components/NetworkError'

// export const BASE_NOTE_FRAGMENT = gql`
//   fragment BaseNote on Note {
//     ... on INote {
//       type
//       _id
//       name
//       createdAt
//       archivedAt
//       description
//       tags {
//         _id
//         name
//         color
//       }
//     }
//     ... on Link {
//       url
//       domain
//     }
//   }
// `

export const NOTE_IMPLICIT_FRAGMENT = `
	... on INote {
		# type
		_id
		name
		createdAt
		archivedAt
		description
		tags {
			_id
			name
			color
		}
	}
	... on Link {
		url
		domain
	}
`

export const NOTES_QUERY = gql`
  query NotesForList {
    notes {
      #...BaseNote
			${NOTE_IMPLICIT_FRAGMENT}
    }
  }
`

const searchFieldShortcutKeys = ['ctrl+f', 'command+f']
const toggleBatchEditingShortcutKeys = ['ctrl+b', 'command+b']
const selectAllShortcutKeys = ['ctrl+a', 'command+a']
const reloadShortcutKeys = ['ctrl+r', 'command+r']

const textIncludes = (needle?: string, haystack?: string): boolean => {
  if (!haystack || !needle) {
    return false
  }

  return haystack.toLowerCase().includes(needle.toLowerCase())
}

const filterNotes = (
  notes,
  searchQuery: string,
  archiveState: ArchiveState,
) => {
  let filteredNotes = notes
  if (searchQuery.length !== 0) {
    filteredNotes = filteredNotes.filter(
      (note) =>
        textIncludes(searchQuery, note.url) ||
        textIncludes(searchQuery, note.name) ||
        note.tags.some((tag) => textIncludes(searchQuery, tag.name)),
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

const ShowMore = styled.div`
  background-color: #eee;
  text-align: center;
  padding: 1em;
`

const NotesPage: React.FC<{}> = () => {
  const {
    linkLayout: layout,
    archiveState,
    searchQuery,
    infiniteScrollLimit,
    batchEditing,
    batchSelections,
  } = useSelector<RootState, UserInterfaceStateType>(
    (state) => state.userInterface,
  )
  const dispatch = useDispatch()
  const searchInput = useRef(null)
  const moreElement = useRef(null)
  const { loading, error, data, refetch } = useQuery<NotesForList>(NOTES_QUERY)

  const selectedNoteCount = (): number =>
    Object.values(batchSelections).filter((selected) => selected).length

  const selectUnselectAll = (selected?: boolean): void => {
    let nextSelectedState = selected
    const selection: BatchSelectionType = {}
    const filteredNotes = filterNotes(data.notes, searchQuery, archiveState)
      .notes
    if (typeof selected === 'undefined') {
      // if no selected target is passed in and all notes are selected, unselect them instead
      nextSelectedState = filteredNotes.length !== selectedNoteCount()
    }
    filteredNotes.forEach((note) => {
      selection[note._id] = nextSelectedState
    })
    dispatch(setBatchSelection(selection))
  }

  useEffect(() => {
    const handleScrollEvent = () => {
      if (!moreElement.current) {
        return
      }

      if (
        moreElement.current.getBoundingClientRect().top < window.innerHeight
      ) {
        dispatch(increaseInfiniteScroll(20))
      }
    }

    Mousetrap.bind(searchFieldShortcutKeys, (): void => {
      searchInput.current.focus()
      setTimeout(() => searchInput.current.select(0, searchQuery.length), 10)
    })
    Mousetrap.bind(toggleBatchEditingShortcutKeys, (): void => {
      dispatch(toggleBatchEditing())
    })
    Mousetrap.bind(selectAllShortcutKeys, (): false => {
      // if we're not already batch editing switch to batch editing mode
      if (!batchEditing) {
        dispatch(toggleBatchEditing())
      }

      selectUnselectAll()

      return false
    })
    Mousetrap.bind(reloadShortcutKeys, () => refetch())
    window.addEventListener('scroll', handleScrollEvent)

    return (): void => {
      Mousetrap.unbind(searchFieldShortcutKeys)
      Mousetrap.unbind(toggleBatchEditingShortcutKeys)
      Mousetrap.unbind(selectAllShortcutKeys)
      Mousetrap.unbind(reloadShortcutKeys)
      window.removeEventListener('scroll', handleScrollEvent)
    }
  }, [])

  const toggleLayout = (): void => {
    dispatch(
      changeLinkLayout(
        layout === LinkLayout.LIST_LAYOUT
          ? LinkLayout.GRID_LAYOUT
          : LinkLayout.LIST_LAYOUT,
      ),
    )
  }

  const nextArchiveState = (): void => {
    switch (archiveState) {
      case ArchiveState.ONLY_ARCHIVE:
        dispatch(changeArchiveState(ArchiveState.BOTH))
        break
      case ArchiveState.BOTH:
        dispatch(changeArchiveState(ArchiveState.NO_ARCHIVE))
        break
      case ArchiveState.NO_ARCHIVE:
        dispatch(changeArchiveState(ArchiveState.ONLY_ARCHIVE))
        break
      default:
        console.error('Unknown layout', archiveState)
    }
  }

  const handleBatchOpenNotes = (): void => {
    data.notes.forEach((note) => {
      if (!batchSelections[note._id]) {
        return
      }
      if (note.__typename !== 'Link') {
        return
      }
      window.open(note.url, '_blank', 'noopener, noreferrer')
    })
  }

  if (error) {
    return <NetworkError error={error} refetch={refetch} />
  }
  if (loading) {
    return <Centered>Loading...</Centered>
  }

  const allNotes = [...data.notes] // unfreeze
  allNotes.sort((noteA, noteB) => noteB.createdAt - noteA.createdAt)

  const {
    notes: matchedNotes,
    archivedCount: archivedMatchedNotesCount,
  } = filterNotes(allNotes, searchQuery, archiveState)

  const content = [
    <NotesMenu
      archiveState={archiveState}
      onChangeSearchQuery={(value): void => {
        dispatch(changeSearchQuery(value))
      }}
      layout={layout}
      toggleLayout={toggleLayout}
      matchedNotes={matchedNotes}
      nextArchiveState={nextArchiveState}
      notes={allNotes}
      searchQuery={searchQuery}
      searchInput={searchInput}
      archivedMatchedNotesCount={archivedMatchedNotesCount}
      key='notes-menu'
    />,
  ]

  if (batchEditing) {
    content.push(
      <StickyMenu key='batch-operations-menu'>
        {selectedNoteCount()} selected (
        <a onClick={(): void => selectUnselectAll(true)}>select all</a>
        ,&nbsp;
        <a onClick={(): void => selectUnselectAll(false)}>unselect all</a>
        ):&nbsp;
        <a onClick={handleBatchOpenNotes}>Open in browser</a>
      </StickyMenu>,
    )
  }

  if (layout !== LinkLayout.LIST_LAYOUT) {
    content.push(<i>Unsupported layout</i>)
  } else {
    const currentLength = infiniteScrollLimit
    content.push(
      <NotesList
        key='notes-list'
        notes={matchedNotes.slice(0, currentLength)}
        batchEditing={batchEditing}
        batchSelections={batchSelections}
        onSetBatchSelected={(noteId, selected): void => {
          dispatch(setBatchSelected(noteId, selected))
        }}
      />,
    )
    if (matchedNotes.length > currentLength) {
      content.push(
        <ShowMore key='more' ref={moreElement}>
          ({matchedNotes.length - currentLength} remaining)
        </ShowMore>,
      )
    }
  }
  return <>{[...content]}</>
}

export default NotesPage
