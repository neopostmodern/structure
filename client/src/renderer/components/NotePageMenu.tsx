import { Archive, Replay } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Tooltip } from '@mui/material';
import useDeleteNote from '../hooks/useDeleteNote';
import useToggleArchivedNote from '../hooks/useToggleArchivedNote';
import { DateOrTimestamp, dateToShortISO8601 } from '../utils/textHelpers';
import DeleteNoteTrigger from './DeleteNoteTrigger';
import { Menu } from './Menu';

const NotePageMenu = ({
  note,
}: {
  note: { _id: string; name: string; archivedAt: DateOrTimestamp };
}) => {
  const {
    toggleArchivedNote,
    errorSnackbar: toggleArchivedNoteErrorSnackbar,
    loading: toggleArchivedNoteLoading,
  } = useToggleArchivedNote(note);
  const {
    deleteNote,
    errorSnackbar: deleteLinkErrorSnackbar,
    loading: deleteLinkLoading,
  } = useDeleteNote(note);
  return (
    <>
      {toggleArchivedNoteErrorSnackbar}
      {deleteLinkErrorSnackbar}
      <Menu>
        <Tooltip title={note.archivedAt ? 'Unarchive note' : 'Archive note'}>
          <LoadingButton
            startIcon={<Archive />}
            onClick={toggleArchivedNote}
            loading={toggleArchivedNoteLoading}
            endIcon={note.archivedAt ? <Replay /> : undefined}
          >
            {note.archivedAt
              ? `Archived at ${dateToShortISO8601(note.archivedAt)}`
              : 'Archive'}
          </LoadingButton>
        </Tooltip>
        <DeleteNoteTrigger
          note={note}
          loading={deleteLinkLoading}
          deleteNote={deleteNote}
        />
      </Menu>
    </>
  );
};

export default NotePageMenu;
