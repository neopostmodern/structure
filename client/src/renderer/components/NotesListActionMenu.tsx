import { Archive, MoreVert, Unarchive } from '@mui/icons-material';
import {
  CircularProgress,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@mui/material';
import { useState } from 'react';
import useDeleteNote from '../hooks/useDeleteNote';
import useToggleArchivedNote from '../hooks/useToggleArchivedNote';
import { NoteObject } from '../reducers/links';
import DeleteNoteTrigger from './DeleteNoteTrigger';

const NotesListActionMenu = ({ note }: { note: NoteObject }) => {
  const {
    toggleArchivedNote,
    errorSnackbar: toggleArchivedNoteErrorSnackbar,
    loading: toggleArchivedNoteLoading,
  } = useToggleArchivedNote(note);
  const {
    deleteNote,
    errorSnackbar: deleteLinkErrorSnackbar,
    loading: deleteLinkLoading,
  } = useDeleteNote(note._id);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {toggleArchivedNoteErrorSnackbar}
      {deleteLinkErrorSnackbar}
      {toggleArchivedNoteLoading || deleteLinkLoading ? (
        <CircularProgress />
      ) : (
        <>
          <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
            <MoreVert />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                toggleArchivedNote();
                handleClose();
              }}
            >
              <ListItemIcon>
                {note.archivedAt ? <Unarchive /> : <Archive />}
              </ListItemIcon>
              {note.archivedAt ? 'Unarchive' : 'Archive'}
            </MenuItem>
            <DeleteNoteTrigger
              variant="menuitem"
              note={note}
              loading={deleteLinkLoading}
              deleteNote={deleteNote}
            />
          </Menu>
        </>
      )}
    </>
  );
};

export default NotesListActionMenu;
