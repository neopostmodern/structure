import { gql, useMutation, useQuery } from '@apollo/client';
import { Warning as WarningIcon } from '@mui/icons-material';
import { Skeleton, Tooltip } from '@mui/material';
import { INTERNAL_TAG_PREFIX } from '@structure/common';
import { useState } from 'react';
import { TAGS_QUERY } from '../containers/TagsPage';
import {
  AddTagByNameToNoteMutation,
  AddTagByNameToNoteMutationVariables,
  TagsQuery,
  TagsWithCountsQuery,
} from '../generated/graphql';
import useUserId from '../hooks/useUserId';
import {
  ADD_TAG_BY_NAME_TO_NOTE_MUTATION,
  BASE_TAG_FRAGMENT,
} from '../utils/sharedQueriesAndFragments';
import { DisplayOnlyTag } from '../utils/types';
import useDataState, { DataState } from '../utils/useDataState';
import ErrorSnackbar from './ErrorSnackbar';
import InlineTagForm from './InlineTagForm';

export const TAGS_WITH_COUNTS_QUERY = gql`
  query TagsWithCounts {
    tags {
      ...BaseTag
      noteCount @client
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
      fetchPolicy: 'cache-only',
    })
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

      const cacheValue = cache.readQuery<TagsQuery>({ query: TAGS_QUERY });

      if (!cacheValue) {
        return;
      }
      const { tags: tagsInCache } = cacheValue;

      const newTags = addTagByNameToNote.tags.filter(
        (tag) => !tagsInCache.some(({ _id }) => _id === tag._id)
      );

      cache.writeQuery({
        query: TAGS_QUERY,
        data: { tags: [...tagsInCache, ...newTags] },
      });
    },
  });

  const handleAddTag = (tagName: string): void => {
    const tagValue = tagName.trim();
    if (tagValue.length > 0) {
      addTagToNote({ variables: { noteId, tagName: tagValue } });
      setSubmittedTag(tagValue);
      onHideTagForm();
    } else {
      // eslint-disable-next-line no-undef
      alert("Can't add empty tag."); // todo: error handling in UI
    }
  };

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
                    permission.user._id === userId && permission.tag.use
                )
            )
      }
      onAddTag={handleAddTag}
      onAbort={onHideTagForm}
    />
  );
};

export default AddTagForm;
