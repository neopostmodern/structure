import { gql } from '@apollo/client';
import React from 'react';
import styled from 'styled-components';
import { TagsQuery_tags } from '../generated/TagsQuery';
import AddTagForm from './AddTagForm';
import TagWithContextMenu from './TagWithContextMenu';

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
  return (
    <TagContainer>
      {tags.map((tag) => (
        <TagWithContextMenu tag={tag} size={size} noteId={noteId} />
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
