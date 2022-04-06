import { gql, useMutation } from '@apollo/client';
import React from 'react';
import styled from 'styled-components';
import {
  RemoveTagByIdFromNote,
  RemoveTagByIdFromNoteVariables,
} from '../generated/RemoveTagByIdFromNote';
import { TagsQuery_tags } from '../generated/TagsQuery';
import AddTagForm from './AddTagForm';
import Tag from './Tag';

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

const TagContainer = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(1)};
`;

interface TagsProps {
  tags: Array<TagsQuery_tags>;
  noteId: string;
  withShortcuts?: boolean;
  size?: 'small' | 'medium';
}

const Tags: React.FC<TagsProps> = ({
  tags,
  noteId,
  size,
  withShortcuts = false,
}) => {
  const [removeTagFromNote] = useMutation<
    RemoveTagByIdFromNote,
    RemoveTagByIdFromNoteVariables
  >(REMOVE_TAG_MUTATION);

  return (
    <TagContainer>
      {tags.map((tag) => (
        <Tag
          key={tag._id}
          tag={tag}
          size={size}
          onContextMenu={(event): void => {
            event.preventDefault();
            removeTagFromNote({ variables: { noteId, tagId: tag._id } });
          }}
        />
      ))}
      <AddTagForm
        withShortcuts={withShortcuts}
        noteId={noteId}
        currentTags={tags}
      />
    </TagContainer>
  );
};

export default Tags;
