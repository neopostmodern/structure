import { useMutation, useQuery } from '@apollo/client/react'
import { useCallback } from 'react'
import type { NoteInForm } from '../components/NoteForm'
import type {
  AddNoteMutation,
  AddNoteMutationVariables,
  NoteQuery,
  NoteQueryVariables,
  UpdateNoteMutation,
  UpdateNoteMutationVariables,
} from '../generated/graphql'
import gracefulNetworkPolicy from '../utils/gracefulNetworkPolicy'
import {
  ADD_NOTE_MUTATION,
  NOTE_QUERY,
  UPDATE_NOTE_MUTATION,
} from '../utils/sharedQueriesAndFragments'
import useDataState from '../utils/useDataState'

export const useNote = (noteId: string) => {
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
        console.error('[useNote.updateNote]', error)
      })
    },
    [updateNote],
  )

  return { noteQuery, updateNoteMutation, handleSubmit }
}

export const useAddNote = ({
  onCompleted,
}: {
  onCompleted: (result: AddNoteMutation) => void
}) => {
  return useMutation<AddNoteMutation, AddNoteMutationVariables>(
    ADD_NOTE_MUTATION,
    {
      onCompleted,
      onError: (error) => {
        console.error(error)
      },
      update: (cache, { data }) => {
        if (!data) {
          return
        }
        const { createNote } = data

        cache.modify({
          id: 'ROOT_QUERY',
          fields: {
            notes(currentRefs: Readonly<Array<{ __ref: string }>>) {
              return currentRefs.concat([{ __ref: `Note:${createNote._id}` }])
            },
          },
        })
      },
    },
  )
}
