import { Archive, MoreVert, Unarchive } from '@mui/icons-material';
import {
  CircularProgress,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@mui/material';
import { useState } from 'react';
import useToggleArchivedNote from '../hooks/useToggleArchivedNote';
import { NoteObject } from '../reducers/links';

const NotesListActionMenu = ({ note }: { note: NoteObject }) => {
  const { toggleArchivedNote, errorSnackbar, loading } =
    useToggleArchivedNote(note);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {errorSnackbar}
      {loading ? (
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
          </Menu>
        </>
      )}
    </>
  );
};

export default NotesListActionMenu;
