import { gql, useMutation } from '@apollo/client';
import ErrorSnackbar from '../components/ErrorSnackbar';
import {
  ToggleArchivedNote,
  ToggleArchivedNoteVariables,
} from '../generated/ToggleArchivedNote';
import { DateOrTimestamp } from '../utils/textHelpers';

const TOGGLE_ARCHIVED_MUTATION = gql`
  mutation ToggleArchivedNote($noteId: ID!) {
    toggleArchivedNote(noteId: $noteId) {
      ... on INote {
        _id
        archivedAt
      }
    }
  }
`;
const useToggleArchivedNote = (note: {
  _id: string;
  archivedAt: DateOrTimestamp;
}) => {
  const [toggleArchivedNote, toggleArchivedNoteMutation] = useMutation<
    ToggleArchivedNote,
    ToggleArchivedNoteVariables
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
