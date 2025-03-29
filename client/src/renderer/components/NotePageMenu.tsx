import { Archive, Replay } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Tooltip } from '@mui/material';
import type { LinkQuery, TextQuery } from '../generated/graphql';
import useDeleteNote from '../hooks/useDeleteNote';
import useHasPermission from '../hooks/useHasPermission';
import useToggleArchivedNote from '../hooks/useToggleArchivedNote';
import { dateToShortISO8601 } from '../utils/textHelpers';
import DeleteNoteTrigger from './DeleteNoteTrigger';
import EntityMetadata from './EntityMetadata';
import { Menu } from './Menu';

const NotePageMenu = ({
  note,
}: {
  note: LinkQuery['link'] | TextQuery['text'];
}) => {
  const onlyReadPermission = !useHasPermission(note, 'notes', 'write');

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
        <EntityMetadata entity={note} />
        {!onlyReadPermission && (
          <>
            <Tooltip
              title={note.archivedAt ? 'Unarchive note' : 'Archive note'}
            >
              <LoadingButton
                startIcon={<Archive />}
                onClick={toggleArchivedNote}
                loading={toggleArchivedNoteLoading}
                endIcon={note.archivedAt ? <Replay /> : undefined}
              >
                {note.archivedAt
                  ? `Archived ${dateToShortISO8601(note.archivedAt)}`
                  : 'Archive'}
              </LoadingButton>
            </Tooltip>
            <DeleteNoteTrigger
              note={note}
              loading={deleteLinkLoading}
              deleteNote={deleteNote}
            />
          </>
        )}
      </Menu>
    </>
  );
};

export default NotePageMenu;
