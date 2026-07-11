import { FC } from 'react'
import FatalApolloError from '../renderer/components/FatalApolloError'
import { DataState } from '../renderer/utils/useDataState'
import useAddCurrentTabNote from './hooks/useAddCurrentTabNote'
import PopupLayout from './PopupLayout'
import AddNoteScreen from './screens/AddNoteScreen'
import NoteScreen from './screens/NoteScreen'

const Popup: FC = () => {
  const currentNote = useAddCurrentTabNote()

  if (currentNote.noteId.state === DataState.LOADING) {
    return <PopupLayout loading />
  }

  if (currentNote.noteId.state === DataState.ERROR) {
    return (
      <FatalApolloError
        key='error'
        error={currentNote.noteId.error}
        refetch={() => window.location.reload()}
      />
    )
  }

  if (!currentNote.noteId.data) {
    return (
      <AddNoteScreen
        isAdding={currentNote.addIsLoading}
        addError={currentNote.addError}
        onAdd={currentNote.add}
        similarNotes={currentNote.similarNotes}
        url={currentNote.url}
        linkNoteId={currentNote.linkNoteId}
      />
    )
  }

  return (
    <NoteScreen
      noteId={currentNote.noteId.data}
      currentUrl={currentNote.url}
      linkNoteId={currentNote.linkNoteId}
    />
  )
}

export default Popup
