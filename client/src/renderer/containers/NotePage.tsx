import React from 'react'
import { useParams } from 'react-router'
import FatalApolloError from '../components/FatalApolloError'
import NetworkOperationsIndicator from '../components/NetworkOperationsIndicator'
import NoteForm from '../components/NoteForm'
import NotePageMenu from '../components/NotePageMenu'
import Tags from '../components/Tags'
import { useNote } from '../hooks/notes'
import { useIsDesktopLayout } from '../utils/mediaQueryHooks'
import { DataState } from '../utils/useDataState'
import ComplexLayout from './ComplexLayout'

const NotePage: React.FC<{ noteId: string }> = ({ noteId }) => {
  const isDesktopLayout = useIsDesktopLayout()

  const { noteQuery, updateNoteMutation, handleSubmit } = useNote(noteId)

  if (noteQuery.state === DataState.LOADING) {
    return <ComplexLayout loading />
  }
  if (noteQuery.state === DataState.ERROR) {
    return (
      <ComplexLayout>
        <FatalApolloError query={noteQuery} />
      </ComplexLayout>
    )
  }

  const { note } = noteQuery.data
  const tagsComponent = (
    <Tags tags={note.tags} size='medium' withShortcuts noteId={note._id} />
  )

  return (
    <ComplexLayout
      primaryActions={isDesktopLayout && tagsComponent}
      secondaryActions={<NotePageMenu note={note} />}
    >
      <NetworkOperationsIndicator
        query={noteQuery}
        mutation={updateNoteMutation}
      />
      <NoteForm
        note={note}
        onSubmit={handleSubmit}
        tagsComponent={!isDesktopLayout && tagsComponent}
      />
    </ComplexLayout>
  )
}

export default () => {
  const { noteId } = useParams()
  // The unique key forces a remount of the NotePage when switching from one
  // note to another. The remount avoids a few difficult issues.
  // One of them is related to data fetching, so this can't be moved further down.
  return <NotePage key={noteId} noteId={noteId!} />
}
