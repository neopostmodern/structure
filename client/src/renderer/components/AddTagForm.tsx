import { gql, useMutation, useQuery } from '@apollo/client';
import {
  AddCircleOutline as PlusIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Button, IconButton, Skeleton, Tooltip } from '@mui/material';
import Mousetrap from 'mousetrap';
import { useEffect, useState } from 'react';
import { TAGS_QUERY } from '../containers/TagsPage';
import {
  AddTagByNameToNoteMutation,
  AddTagByNameToNoteMutationVariables,
  TagsQuery,
  TagsWithCountsQuery,
} from '../generated/graphql';
import useIsOnline from '../hooks/useIsOnline';
import makeMousetrapGlobal from '../utils/mousetrapGlobal';
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

makeMousetrapGlobal(Mousetrap);

const tagShortcutKeys = ['ctrl+t', 'command+t'];

const AddTagForm = ({
  noteId,
  withShortcuts,
  currentTags,
}: {
  noteId: string;
  withShortcuts?: boolean;
  currentTags: Array<DisplayOnlyTag>;
}) => {
  const [addingNew, setAddingNew] = useState<boolean>(false);
  const [submittedTag, setSubmittedTag] = useState<string | null>(null);

  const tagsQuery = useDataState(
    useQuery<TagsWithCountsQuery>(TAGS_WITH_COUNTS_QUERY, {
      fetchPolicy: 'cache-only',
    })
  );

  const [addTagToNote, addTagToNoteMutation] = useMutation<
    AddTagByNameToNoteMutation,
    AddTagByNameToNoteMutationVariables
  >(ADD_TAG_MUTATION, {
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

  const showNewTagForm = (): void => {
    setAddingNew(true);
  };

  const hideNewTagForm = (): void => {
    setAddingNew(false);
  };

  useEffect(() => {
    if (withShortcuts) {
      Mousetrap.bindGlobal(tagShortcutKeys, showNewTagForm);
    }

    return (): void => {
      if (withShortcuts) {
        Mousetrap.unbind(tagShortcutKeys);
      }
    };
  });

  const handleAddTag = (tagName: string): void => {
    const tagValue = tagName.trim();
    if (tagValue.length > 0) {
      addTagToNote({ variables: { noteId, tagName: tagValue } });
      setSubmittedTag(tagValue);
      hideNewTagForm();
    } else {
      // eslint-disable-next-line no-undef
      alert("Can't add empty tag."); // todo: error handling in UI
    }
  };

  const isOnline = useIsOnline();
  if (!isOnline) {
    return null;
  }
  if (addTagToNoteMutation.loading) {
    return (
      <Skeleton variant="text" height={'2.2rem'}>
        <div>{submittedTag}</div>
      </Skeleton>
    );
  }
  if (addingNew) {
    if (tagsQuery.state === DataState.ERROR) {
      return (
        <>
          <ErrorSnackbar
            error={tagsQuery.error}
            actionDescription="load tags"
          />
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
                (tag) => !currentTags.some(({ _id }) => _id === tag._id)
              )
        }
        onAddTag={handleAddTag}
        onAbort={hideNewTagForm}
      />
    );
  } else if (currentTags.length === 0) {
    return (
      <Button variant="outlined" size="small" onClick={showNewTagForm}>
        Add tag
      </Button>
    );
  }

  return (
    <Tooltip title="Add tag">
      <IconButton size="small" onClick={showNewTagForm}>
        <PlusIcon />
      </IconButton>
    </Tooltip>
  );
};

export default AddTagForm;
