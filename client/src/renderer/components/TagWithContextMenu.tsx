import { useMutation } from '@apollo/client';
import { Edit, RemoveCircleOutline } from '@mui/icons-material';
import { CircularProgress, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import {
  RemoveTagByIdFromNoteMutation,
  RemoveTagByIdFromNoteMutationVariables,
} from '../generated/graphql';
import { DisplayOnlyTag } from '../utils/types';
import ErrorSnackbar from './ErrorSnackbar';
import Tag from './Tag';
import { REMOVE_TAG_MUTATION } from './Tags';

const TagWithContextMenu = ({
  tag,
  size,
  noteId,
}: {
  tag: DisplayOnlyTag;
  size?: 'small' | 'medium';
  noteId: string;
}) => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [removeTagFromNote, removeTagFromNoteMutation] = useMutation<
    RemoveTagByIdFromNoteMutation,
    RemoveTagByIdFromNoteMutationVariables
  >(REMOVE_TAG_MUTATION);

  const doRemoveTagFromNote = () => {
    removeTagFromNoteMutation.reset();
    removeTagFromNote({ variables: { noteId, tagId: tag._id } });
  };

  if (removeTagFromNoteMutation.loading) {
    return <CircularProgress size={'1.5rem'} />;
  }

  return (
    <>
      <ErrorSnackbar
        error={removeTagFromNoteMutation.error}
        actionDescription={'remove tag from note'}
        retry={doRemoveTagFromNote}
      />
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            dispatch(push(`/tags/${tag._id}`));
            handleClose();
          }}
        >
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          Edit tag
        </MenuItem>
        <MenuItem
          onClick={() => {
            doRemoveTagFromNote();
            handleClose();
          }}
        >
          <ListItemIcon>
            <RemoveCircleOutline />
          </ListItemIcon>
          Remove tag from note
        </MenuItem>
      </Menu>
      <Tag
        key={tag._id}
        tag={tag}
        size={size}
        onContextMenu={(event): void => {
          event.preventDefault();
          setAnchorEl(event.currentTarget);
        }}
      />
    </>
  );
};

export default TagWithContextMenu;
