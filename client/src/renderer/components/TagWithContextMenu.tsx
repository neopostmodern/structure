import { useMutation } from '@apollo/client';
import { Edit, RemoveCircleOutline } from '@mui/icons-material';
import { CircularProgress, ListItemIcon, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { goBack, push } from 'redux-first-history';
import {
  RemoveTagByIdFromNoteMutation,
  RemoveTagByIdFromNoteMutationVariables,
} from '../generated/graphql';
import { hasPermission } from '../hooks/useHasPermission';
import useUserId from '../hooks/useUserId';
import { removeEntityFromCache } from '../utils/cache';
import { DisplayOnlyTag } from '../utils/types';
import ErrorSnackbar from './ErrorSnackbar';
import Tag from './Tag';
import { REMOVE_TAG_MUTATION } from './Tags';

const TagWithContextMenu = ({
  tag,
  size,
  noteId,
  noteReadOnly = false,
}: {
  tag: DisplayOnlyTag;
  size?: 'small' | 'medium';
  noteId: string;
  noteReadOnly?: boolean;
}) => {
  const dispatch = useDispatch();
  const userId = useUserId();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [removeTagFromNote, removeTagFromNoteMutation] = useMutation<
    RemoveTagByIdFromNoteMutation,
    RemoveTagByIdFromNoteMutationVariables
  >(REMOVE_TAG_MUTATION, {
    update: (cache, { data }) => {
      if (!data) {
        throw Error(
          '[TagWithContextMenu/removeTagFromNote.update] No data returned from mutation'
        );
      }

      if (!hasPermission(userId, data.removeTagByIdFromNote, 'notes', 'read')) {
        removeEntityFromCache(cache, data.removeTagByIdFromNote);
        if (location.href.includes(data.removeTagByIdFromNote._id)) {
          dispatch(goBack());
        }
      }
    },
  });

  const doRemoveTagFromNote = () => {
    removeTagFromNoteMutation.reset();
    (async () => {
      try {
        await removeTagFromNote({ variables: { noteId, tagId: tag._id } });
      } catch (error) {
        console.error(error);
      }
    })();
  };

  if (removeTagFromNoteMutation.loading) {
    return <CircularProgress size={'1.5rem'} />;
  }

  const tagMenuItems = [];
  if (tag.permissions.find(({ user }) => userId === user._id)?.tag.write) {
    tagMenuItems.push(
      <MenuItem
        key="edit"
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
    );
  }
  if (!noteReadOnly) {
    tagMenuItems.push(
      <MenuItem
        key="remove"
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
    );
  }

  return (
    <>
      <ErrorSnackbar
        error={removeTagFromNoteMutation.error}
        actionDescription={'remove tag from note'}
        retry={doRemoveTagFromNote}
      />
      {tagMenuItems.length > 0 && (
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {[...tagMenuItems]}
        </Menu>
      )}
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
