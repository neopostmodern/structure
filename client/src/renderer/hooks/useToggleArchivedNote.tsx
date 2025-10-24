import { gql } from '@apollo/client';
import { useMutation } from "@apollo/client/react";
import ErrorSnackbar from '../components/ErrorSnackbar';
import type {
  ToggleArchivedNoteMutation,
  ToggleArchivedNoteMutationVariables,
} from '../generated/graphql';
import { DateOrTimestamp } from '../utils/textHelpers';

const TOGGLE_ARCHIVED_MUTATION = gql`
  mutation ToggleArchivedNote($noteId: ID!) {
    toggleArchivedNote(noteId: $noteId) {
      ... on INote {
        _id
        archivedAt
        updatedAt
      }
    }
  }
`;
const useToggleArchivedNote = (note: {
  _id: string;
  archivedAt?: DateOrTimestamp | null;
}) => {
  const [toggleArchivedNote, toggleArchivedNoteMutation] = useMutation<
    ToggleArchivedNoteMutation,
    ToggleArchivedNoteMutationVariables
  >(TOGGLE_ARCHIVED_MUTATION);
  const doToggleArchivedNote = async () => {
    toggleArchivedNoteMutation.reset();
    try {
      await toggleArchivedNote({ variables: { noteId: note._id } });
    } catch (e) {}
  };
  return {
    toggleArchivedNote: doToggleArchivedNote,
    loading: toggleArchivedNoteMutation.loading,
    errorSnackbar: (
      <ErrorSnackbar
        error={toggleArchivedNoteMutation.error}
        actionDescription={note.archivedAt ? 'unarchive' : 'archive'}
        retry={() => {
          doToggleArchivedNote();
        }}
      />
    ),
  };
};

export default useToggleArchivedNote;
