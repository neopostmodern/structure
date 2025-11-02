import { AddCircle, Create } from '@mui/icons-material'
import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { QUICK_ACCESS_SHORTCUT_PREFIX, SHORTCUTS } from '../utils/keyboard'
import EmptyPageInfo from './EmptyPageInfo'
import Gap from './Gap'
import NoteInList from './NoteInList'
import Shortcut from './Shortcut'
import ShowMore from './ShowMore'

const NotesList: React.FC<{
  noteIds: Array<string>
  expanded: boolean
  initialCount: number
}> = ({ noteIds, expanded, initialCount }) => {
  const dispatch = useDispatch()
  // todo
  // useQuickNumberShortcuts(notes, (note) => {
  //   dispatch(push(noteUrl(note)))
  // })

  const [notesDisplayLimit, setNotesDisplayLimit] = useState(initialCount)
  const handleIsInView = useCallback(
    () => setNotesDisplayLimit((limit) => limit + 10),
    [setNotesDisplayLimit],
  )

  if (noteIds.length === 0) {
    return (
      <EmptyPageInfo
        icon={Create}
        title='A blank page'
        subtitle={
          <>
            You can add a new note by hitting the{' '}
            <AddCircle
              color='primary'
              fontSize='inherit'
              style={{ position: 'relative', top: '0.2em' }}
            />{' '}
            or using the shortcut{' '}
            <Shortcut shortcuts={SHORTCUTS.NEW_NOTE_PAGE}></Shortcut>
          </>
        }
      />
    )
  }

  return (
    <>
      <Gap vertical={1} />
      <div>
        {noteIds.slice(0, notesDisplayLimit).map((noteId, noteIndex) => (
          <NoteInList
            key={noteId}
            noteId={noteId}
            expanded={expanded}
            shortcut={
              SHORTCUTS[`${QUICK_ACCESS_SHORTCUT_PREFIX}${noteIndex + 1}`]
            }
          />
        ))}
      </div>
      {noteIds.length > notesDisplayLimit && (
        <ShowMore
          onIsInView={handleIsInView}
          remainingCount={noteIds.length - notesDisplayLimit}
        />
      )}
    </>
  )
}

export default React.memo(NotesList)
