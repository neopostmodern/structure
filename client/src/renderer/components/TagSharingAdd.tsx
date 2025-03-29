import { gql, useMutation } from '@apollo/client';
import { Send } from '@mui/icons-material';
import {
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type {
  ShareTagMutation,
  ShareTagMutationVariables,
  TagsQuery,
} from '../generated/graphql';
import ErrorSnackbar from './ErrorSnackbar';
import { FormSubheader } from './formComponents';
import Gap from './Gap';

type TagType = TagsQuery['tags'][number];
interface FormData {
  username: string;
}

const SHARE_TAG_MUTATION = gql`
  mutation ShareTag($tagId: ID!, $username: String!) {
    shareTag(tagId: $tagId, username: $username) {
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

const TagSharingAdd = ({ tag }: { tag: TagType }) => {
  const formProps = useForm<FormData>({ defaultValues: { username: '' } });
  const { formState, register, handleSubmit, reset } = formProps;

  const [shareTag, shareTagMutation] = useMutation<
    ShareTagMutation,
    ShareTagMutationVariables
  >(SHARE_TAG_MUTATION);

  const onSubmit = useCallback(
    ({ username }: FormData) => {
      (async () => {
        try {
          await shareTag({ variables: { tagId: tag._id, username } });
          reset();
        } catch (error) {
          console.error('[TagSharingAdd.onSubmit]', error);
        }
      })();
    },
    [shareTag, reset]
  );

  return (
    <>
      <ErrorSnackbar
        error={shareTagMutation.error}
        actionDescription="Share tag"
      />
      <FormProvider {...formProps}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormSubheader>Share tag with another user</FormSubheader>
          <Gap vertical={0.25} />
          <Stack direction="row" gap={2}>
            <TextField
              type="text"
              {...register('username', {
                validate: (username) => {
                  if (username.length === 0) {
                    return 'Please provide a username';
                  }
                  if (
                    tag.permissions.some(
                      ({ user: { name } }) => name === username
                    )
                  ) {
                    return 'Already shared with this user';
                  }
                  return undefined;
                },
              })}
              label="Username"
              error={Boolean(formState.errors.username)}
              helperText={formState.errors.username?.message}
              disabled={shareTagMutation.loading}
              InputProps={{
                endAdornment: shareTagMutation.loading ? (
                  <CircularProgress disableShrink />
                ) : (
                  <IconButton type="submit">
                    <Send />
                  </IconButton>
                ),
              }}
              sx={{ minWidth: '15em' }}
            />
            <Typography variant="caption" component="p">
              The user will be able to see both the tag and the notes tagged
              with it.
              <br />
              Once shared you can specify whether the user can also change the
              shared notes and the tag itself.
            </Typography>
          </Stack>
        </form>
      </FormProvider>
    </>
  );
};

export default TagSharingAdd;
