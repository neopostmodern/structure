import { gql, useMutation } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import ErrorSnackbar from '../components/ErrorSnackbar';
import { NOTES_QUERY } from '../containers/NotesPage/NotesPage';
import { NotesForList } from '../generated/NotesForList';
import {
  ToggleDeletedNoteMutation,
  ToggleDeletedNoteMutationVariables,
} from '../generated/ToggleDeletedNoteMutation';

const TOGGLE_DELETED_NOTE_MUTATION = gql`
  mutation ToggleDeletedNoteMutation($noteId: ID!) {
    toggleDeletedNote(noteId: $noteId) {
      ... on INote {
        _id
        deletedAt
      }
    }
  }
`;

const useDeleteNote = (noteId: string | null | undefined) => {
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
      const cacheData = cache.readQuery<NotesForList>({ query: NOTES_QUERY });
      if (!cacheData) {
        throw Error('[useDeletedLink.update] No data returned from cache');
      }
      const { notes } = cacheData;
      if (!data.toggleDeletedNote.deletedAt) {
        throw Error("[useDeletedLink.update] Can't handle un-delete yet.");
      }
      cache.writeQuery({
        query: NOTES_QUERY,
        data: {
          notes: notes.filter(({ _id }) => _id !== data.toggleDeletedNote._id),
        },
      });
    },
  });

  const doDeleteNote = async () => {
    if (!noteId) {
      throw Error(
        '[useDeleteNote] doDeleteNote called before link was provided'
      );
    }
    toggleDeletedNoteMutation.reset();
    try {
      await toggleDeletedNote({
        variables: { noteId },
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
