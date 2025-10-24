import { gql } from '@apollo/client';
import { useMutation } from "@apollo/client/react";
import { Delete } from '@mui/icons-material';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { goBack } from 'redux-first-history';
import type {
  UnshareTagMutation,
  UnshareTagMutationVariables,
} from '../generated/graphql';
import useUserId from '../hooks/useUserId';
import ErrorSnackbar from './ErrorSnackbar';

const UNSHARE_TAG_MUTATION = gql`
  mutation UnshareTag($tagId: ID!, $userId: ID!) {
    unshareTag(tagId: $tagId, userId: $userId) {
      _id
      updatedAt
      permissions {
        user {
          _id
        }
        tag {
          read
          write
          use
          share
        }
        notes {
          read
          write
        }
      }
    }
  }
`;

const TagSharingDelete = ({
  tagId,
  userId,
}: {
  tagId: string;
  userId: string;
}) => {
  const loggedInUserId = useUserId();
  const dispatch = useDispatch();
  const [unshareTag, unshareTagMutation] = useMutation<
    UnshareTagMutation,
    UnshareTagMutationVariables
  >(UNSHARE_TAG_MUTATION, {
    variables: {
      tagId,
      userId,
    },
    onCompleted({ unshareTag: updatedTag }) {
      if (!updatedTag) {
        return;
      }
      if (
        !updatedTag.permissions.some(({ user }) => user._id === loggedInUserId)
      ) {
        dispatch(goBack());
      }
    },
  });

  const handleClick = useCallback(() => {
    (async () => {
      try {
        await unshareTag();
      } catch (error) {
        console.error('[TagSharingDelete.handleClick]', error);
      }
    })();
  }, [unshareTag]);

  return (
    <>
      <ErrorSnackbar
        error={unshareTagMutation.error}
        actionDescription="Unshare tag"
        retry={handleClick}
      />
      {unshareTagMutation.loading ? (
        <CircularProgress disableShrink size="1.2em" />
      ) : (
        <Tooltip title="Remove share">
          <IconButton onClick={handleClick} size="small">
            <Delete />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

export default TagSharingDelete;
