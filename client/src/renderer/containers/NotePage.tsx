import { useMutation, useQuery } from '@apollo/client/react'
import { gql } from 'graphql-tag'
import React, { useCallback } from 'react'
import { useParams } from 'react-router'
import FatalApolloError from '../components/FatalApolloError'
import NetworkOperationsIndicator from '../components/NetworkOperationsIndicator'
import NoteForm, { NoteInForm } from '../components/NoteForm'
import NotePageMenu from '../components/NotePageMenu'
import Tags from '../components/Tags'
import type {
  NoteQuery,
  NoteQueryVariables,
  UpdateNoteMutation,
  UpdateNoteMutationVariables,
} from '../generated/graphql'
import gracefulNetworkPolicy from '../utils/gracefulNetworkPolicy'
import { useIsDesktopLayout } from '../utils/mediaQueryHooks'
import {
  BASE_TAG_FRAGMENT,
  BASE_USER_FRAGMENT,
} from '../utils/sharedQueriesAndFragments'
import useDataState, { DataState } from '../utils/useDataState'
import ComplexLayout from './ComplexLayout'

const NOTE_QUERY = gql`
  query Note($noteId: ID!) {
    note(noteId: $noteId) {
      _id
      createdAt
      updatedAt
      changedAt
      archivedAt
      user {
        ...BaseUser
      }
      url
      name
      description
      domain
      tags {
        ...BaseTag
      }
    }
  }
  ${BASE_USER_FRAGMENT}
  ${BASE_TAG_FRAGMENT}
`

const UPDATE_NOTE_MUTATION = gql`
  mutation UpdateNote($note: InputNote!) {
    updateNote(note: $note) {
      _id
      createdAt
      updatedAt
      changedAt
      url
      domain
      name
      description
      tags {
        _id
        name
        color
      }
    }
  }
`

const NotePage: React.FC<{ noteId: string }> = ({ noteId }) => {
  const isDesktopLayout = useIsDesktopLayout()

  const noteQuery = useDataState(
    useQuery<NoteQuery, NoteQueryVariables>(NOTE_QUERY, {
      fetchPolicy: gracefulNetworkPolicy(),
      variables: { noteId },
    }),
  )

  const [updateNote, updateNoteMutation] = useMutation<
    UpdateNoteMutation,
    UpdateNoteMutationVariables
  >(UPDATE_NOTE_MUTATION)
  const handleSubmit = useCallback(
    (updatedNote: NoteInForm): void => {
      updateNote({ variables: { note: updatedNote } }).catch((error) => {
        console.error('[NotePage.updateNote]', error)
      })
    },
    [updateNote],
  )

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
