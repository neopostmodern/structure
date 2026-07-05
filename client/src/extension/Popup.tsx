import { FC } from 'react'
import FatalApolloError from '../renderer/components/FatalApolloError'
import { DataState } from '../renderer/utils/useDataState'
import useAddCurrentTabNote from './hooks/useAddCurrentTabNote'
import useAuth from './hooks/useAuth'
import PopupLayout from './PopupLayout'
import AddNoteScreen from './screens/AddNoteScreen'
import LoginScreen from './screens/LoginScreen'
import NoteScreen from './screens/NoteScreen'

const Popup: FC = () => {
  const auth = useAuth()
  const currentNote = useAddCurrentTabNote()

  if (
    auth.authState === 'checking' ||
    auth.authState === 'loading-profile' ||
    currentNote.noteId.state === DataState.LOADING
  ) {
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

  if (auth.authState === 'logged-out') {
    return (
      <LoginScreen
        loggingIn={auth.loggingIn}
        loginError={auth.loginError}
        onLogIn={auth.logIn}
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
      userId={auth.userId}
      currentUrl={currentNote.url}
      linkNoteId={currentNote.linkNoteId}
    />
  )
}

export default Popup
