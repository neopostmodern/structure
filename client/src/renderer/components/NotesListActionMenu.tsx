import {
  Archive,
  ContentCopy,
  Launch,
  MoreVert,
  Share,
  Unarchive,
} from '@mui/icons-material';
import {
  CircularProgress,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@mui/material';
import { useState } from 'react';
import { NotesForListQuery } from '../generated/graphql';
import useDeleteNote from '../hooks/useDeleteNote';
import useHasPermission from '../hooks/useHasPermission';
import useToggleArchivedNote from '../hooks/useToggleArchivedNote';
import { openInDefaultBrowser, shareUrl } from '../utils/openWith';
import DeleteNoteTrigger from './DeleteNoteTrigger';

const NotesListActionMenu = ({
  note,
}: {
  note: NotesForListQuery['notes'][number];
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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const readOnly = !useHasPermission(note, 'notes', 'write');

  if (readOnly && !('url' in note)) {
    // the menu would be empty for text notes
    return null;
  }

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
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClick={() => {
              handleClose();
            }}
            onClose={handleClose}
          >
            {'url' in note && note.url && (
              <MenuItem onClick={() => openInDefaultBrowser(note.url)}>
                <ListItemIcon>
                  <Launch />
                </ListItemIcon>
                Open in browser
              </MenuItem>
            )}
            {'url' in note && note.url && (
              <MenuItem onClick={() => navigator.clipboard.writeText(note.url)}>
                <ListItemIcon>
                  <ContentCopy />
                </ListItemIcon>
                Copy URL
              </MenuItem>
            )}
            {'url' in note && note.url && navigator.share && (
              <MenuItem onClick={() => shareUrl(note.url, note.name)}>
                <ListItemIcon>
                  <Share />
                </ListItemIcon>
                Share URL
              </MenuItem>
            )}
            {!readOnly && [
              <MenuItem
                key="archive"
                onClick={() => {
                  toggleArchivedNote();
                }}
              >
                <ListItemIcon>
                  {note.archivedAt ? <Unarchive /> : <Archive />}
                </ListItemIcon>
                {note.archivedAt ? 'Unarchive' : 'Archive'}
              </MenuItem>,
              <DeleteNoteTrigger
                key="delete"
                variant="menuitem"
                note={note}
                loading={deleteLinkLoading}
                deleteNote={() => {
                  deleteNote();
                }}
              />,
            ]}
          </Menu>
        </>
      )}
    </>
  );
};

export default NotesListActionMenu;
