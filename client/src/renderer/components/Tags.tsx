import { gql, useMutation, useQuery } from '@apollo/client';
import Mousetrap from 'mousetrap';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TAGS_QUERY } from '../containers/TagsPage';
import {
  AddTagByNameToNote,
  AddTagByNameToNoteVariables,
} from '../generated/AddTagByNameToNote';
import {
  RemoveTagByIdFromNote,
  RemoveTagByIdFromNoteVariables,
} from '../generated/RemoveTagByIdFromNote';
import { TagsQuery } from '../generated/TagsQuery';
import { TagType } from '../types';
import makeMousetrapGlobal from '../utils/mousetrapGlobal';
import InlineTagForm from './InlineTagForm';
import Tag, { AddNewTag } from './Tag';

makeMousetrapGlobal(Mousetrap);

export const ADD_TAG_MUTATION = gql`
  mutation AddTagByNameToNote($noteId: ID!, $tagName: String!) {
    addTagByNameToNote(noteId: $noteId, name: $tagName) {
      ... on INote {
        _id
        tags {
          _id
          name
          color
        }
      }
    }
  }
`;

export const REMOVE_TAG_MUTATION = gql`
  mutation RemoveTagByIdFromNote($noteId: ID!, $tagId: ID!) {
    removeTagByIdFromNote(noteId: $noteId, tagId: $tagId) {
      ... on INote {
        _id
        tags {
          _id
          name
          color
        }
      }
    }
  }
`;

const tagShortcutKeys = ['ctrl+t', 'command+t'];

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

interface TagsProps {
  tags: Array<TagType>;
  noteId: string;
  withShortcuts?: boolean;
}

const Tags: React.FC<TagsProps> = ({ tags, noteId, withShortcuts = false }) => {
  const [addingNew, setAddingNew] = useState<boolean>(false);

  const tagsQuery = useQuery<TagsQuery>(TAGS_QUERY);

  // todo: show loading indicator
  const [addTagToNote] = useMutation<
    AddTagByNameToNote,
    AddTagByNameToNoteVariables
  >(ADD_TAG_MUTATION, {
    update: (cache, { data: { addTagByNameToNote } }) => {
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

  const [removeTagFromNote] = useMutation<
    RemoveTagByIdFromNote,
    RemoveTagByIdFromNoteVariables
  >(REMOVE_TAG_MUTATION);

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
      hideNewTagForm();
    } else {
      // eslint-disable-next-line no-undef
      alert("Can't add empty tag."); // todo: error handling in UI
    }
  };

  let newTagForm;
  if (addingNew) {
    newTagForm = (
      <InlineTagForm
        tags={
          tagsQuery.loading
            ? 'loading'
            : tagsQuery.data.tags.filter(
                (tag) => !tags.some(({ _id }) => _id === tag._id)
              )
        }
        onAddTag={handleAddTag}
        onAbort={hideNewTagForm}
      />
    );
  } else {
    const addTagText = tags.length === 0 ? '+tag' : '+';
    newTagForm = <AddNewTag onClick={showNewTagForm}>{addTagText}</AddNewTag>;
  }
  return (
    <TagContainer>
      {tags.map((tag) => (
        <Tag
          key={tag._id}
          tag={tag}
          onContextMenu={(event): void => {
            event.preventDefault();
            removeTagFromNote({ variables: { noteId, tagId: tag._id } });
          }}
        />
      ))}
      {newTagForm}
    </TagContainer>
  );
};

export default Tags;
