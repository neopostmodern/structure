import { gql } from '@apollo/client';
import { useMutation } from "@apollo/client/react";
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import ErrorSnackbar from '../components/ErrorSnackbar';
import type {
  ToggleDeletedNoteMutation,
  ToggleDeletedNoteMutationVariables,
} from '../generated/graphql';
import { removeEntityFromCache } from '../utils/cache';

const TOGGLE_DELETED_NOTE_MUTATION = gql`
  mutation ToggleDeletedNote($noteId: ID!) {
    toggleDeletedNote(noteId: $noteId) {
      ... on INote {
        _id
        deletedAt
      }
    }
  }
`;

const useDeleteNote = (note: { _id: string }) => {
  const dispatch = useDispatch();
  const [toggleDeletedNote, toggleDeletedNoteMutation] = useMutation<
    ToggleDeletedNoteMutation,
    ToggleDeletedNoteMutationVariables
  >(TOGGLE_DELETED_NOTE_MUTATION, {
    onCompleted: () => {
      dispatch(push('/'));
    },
    update(cache, { data }) {
      if (!data) {
        throw Error('[useDeletedLink.update] No data returned from mutation');
      }
      if (!data.toggleDeletedNote.deletedAt) {
        throw Error("[useDeletedLink.update] Can't handle un-delete yet.");
      }

      removeEntityFromCache(cache, data.toggleDeletedNote);
    },
  });

  const doDeleteNote = async () => {
    toggleDeletedNoteMutation.reset();
    try {
      await toggleDeletedNote({
        variables: { noteId: note._id },
      });
    } catch (e) {}
  };
  return {
    deleteNote: doDeleteNote,
    loading: toggleDeletedNoteMutation.loading,
    errorSnackbar: (
      <ErrorSnackbar
        error={toggleDeletedNoteMutation.error}
        actionDescription={'delete note'}
        retry={() => {
          doDeleteNote();
        }}
      />
    ),
  };
};

export default useDeleteNote;
