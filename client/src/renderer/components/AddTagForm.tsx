import { gql, useQuery, useMutation } from '@apollo/client';
import { Warning as WarningIcon } from '@mui/icons-material';
import { Skeleton, Tooltip } from '@mui/material';
import { INTERNAL_TAG_PREFIX } from '@structure/common';
import { useCallback, useState } from 'react';
import type {
  AddTagByNameToNoteMutation,
  AddTagByNameToNoteMutationVariables,
  TagsWithCountsQuery,
} from '../generated/graphql';
import useUserId from '../hooks/useUserId';
import {
  BASE_TAG_FRAGMENT,
  ADD_TAG_BY_NAME_TO_NOTE_MUTATION,
} from '../utils/sharedQueriesAndFragments';
import { DisplayOnlyTag } from '../utils/types';
import useDataState, { DataState } from '../utils/useDataState';
import ErrorSnackbar from './ErrorSnackbar';
import InlineTagForm from './InlineTagForm';

export const TAGS_WITH_COUNTS_QUERY = gql`
  query TagsWithCounts {
    tags {
      ...BaseTag
      noteCount
    }
  }
  ${BASE_TAG_FRAGMENT}
`;

export type AddTagFormProps = {
  noteId: string;
  currentTags: Array<DisplayOnlyTag>;
};
const AddTagForm = ({
  noteId,
  currentTags,
  onHideTagForm,
}: AddTagFormProps & { onHideTagForm: () => void }) => {
  const userId = useUserId();
  const [submittedTag, setSubmittedTag] = useState<string | null>(null);

  const tagsQuery = useDataState(
    useQuery<TagsWithCountsQuery>(TAGS_WITH_COUNTS_QUERY, {
      fetchPolicy: 'cache-first',
    }),
  );

  const [addTagToNote, addTagToNoteMutation] = useMutation<
    AddTagByNameToNoteMutation,
    AddTagByNameToNoteMutationVariables
  >(ADD_TAG_BY_NAME_TO_NOTE_MUTATION, {
    update: (cache, { data }) => {
      if (!data) {
        return;
      }
      const { addTagByNameToNote } = data;

      cache.modify({
        id: 'ROOT_QUERY',
        fields: {
          tags(
            existingTagsRefs: Array<{ __ref: string }> = [],
          ): Array<{ __ref: string }> {
            const newTags = addTagByNameToNote.tags
              .filter((tag) => {
                const tagCacheId = cache.identify(tag);

                return !existingTagsRefs.some(
                  ({ __ref }) => __ref === tagCacheId,
                );
              })
              .map((tag) => ({ __ref: cache.identify(tag)! }));
            return [...existingTagsRefs, ...newTags];
          },
        },
      });
    },
  });

  const handleAddTag = (tagName: string): void => {
    const tagValue = tagName.trim();
    if (tagValue.length > 0) {
      (async () => {
        try {
          setSubmittedTag(tagValue);
          await addTagToNote({ variables: { noteId, tagName: tagValue } });
          onHideTagForm();
        } catch (error) {
          console.error('[AddTagForm.handleAddTag]', error);
        }
      })();
    } else {
      // eslint-disable-next-line no-undef
      alert("Can't add empty tag."); // todo: error handling in UI
    }
  };

  const handleAbort = useCallback(
    (explicit?: boolean) => {
      if (!explicit && addTagToNoteMutation.error) {
        return;
      }
      onHideTagForm();
    },
    [onHideTagForm, addTagToNoteMutation.error],
  );

  if (addTagToNoteMutation.loading) {
    return (
      <Skeleton variant="text" height={'2.2rem'}>
        <div>{submittedTag}</div>
      </Skeleton>
    );
  }
  if (tagsQuery.state === DataState.ERROR) {
    return (
      <>
        <ErrorSnackbar error={tagsQuery.error} actionDescription="load tags" />
        <Tooltip title="Failed to load tags">
          <WarningIcon color="error" />
        </Tooltip>
      </>
    );
  }

  return (
    <>
      <ErrorSnackbar
        error={addTagToNoteMutation.error}
        actionDescription={'add tag'}
      />
      <InlineTagForm
        tags={
          tagsQuery.state === DataState.LOADING
            ? 'loading'
            : tagsQuery.data.tags.filter(
                (tag) =>
                  !currentTags.some(({ _id }) => _id === tag._id) &&
                  !tag.name.startsWith(INTERNAL_TAG_PREFIX) &&
                  tag.permissions.some(
                    (permission) =>
                      permission.user._id === userId && permission.tag.use,
                  ),
              )
        }
        onAddTag={handleAddTag}
        onAbort={handleAbort}
      />
    </>
  );
};

export default AddTagForm;
