import { ArrowBack, OpenInNew } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { FC, useCallback } from 'react'
import browser from 'webextension-polyfill'
import ErrorSnackbar from '../../renderer/components/ErrorSnackbar'
import NoteForm from '../../renderer/components/NoteForm'
import Tags from '../../renderer/components/Tags'
import { useNote } from '../../renderer/hooks/notes'
import { DataState } from '../../renderer/utils/useDataState'
import UserIdContext from '../../renderer/utils/UserIdContext'
import PopupLayout from '../PopupLayout'

const handleOpenInApp = (noteId: string) => {
  browser.tabs.create({ url: `${__WEB_FRONTEND_HOST__}/notes/${noteId}` })
  window.close()
}

const NoteScreen: FC<{
  noteId: string
  userId: string
  currentUrl: string | undefined
  linkNoteId: (noteId: null) => void
}> = ({ noteId, userId, currentUrl, linkNoteId }) => {
  const { noteQuery, updateNoteMutation, handleSubmit } = useNote(noteId)
  const onOpenInApp = useCallback(() => handleOpenInApp(noteId), [noteId])

  if (noteQuery.state !== DataState.DATA) {
    return <PopupLayout loading />
  }

  const { note } = noteQuery.data

  return (
    <UserIdContext.Provider value={userId}>
      <PopupLayout
        topBarActions={
          <>
            {currentUrl !== note.url && (
              <IconButton
                onClick={() => linkNoteId(null)}
                sx={{ marginRight: 'auto' }}
              >
                <ArrowBack />
              </IconButton>
            )}
            <IconButton onClick={onOpenInApp}>
              <OpenInNew />
            </IconButton>
          </>
        }
      >
        <ErrorSnackbar
          error={updateNoteMutation.error}
          actionDescription='update note'
        />
        <NoteForm
          note={note}
          onSubmit={handleSubmit}
          tagsComponent={
            <Tags
              tags={note.tags}
              size='medium'
              withShortcuts
              noteId={note._id}
            />
          }
        />
      </PopupLayout>
    </UserIdContext.Provider>
  )
}

export default NoteScreen
