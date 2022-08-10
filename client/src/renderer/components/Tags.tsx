import { gql } from '@apollo/client';
import React from 'react';
import styled from 'styled-components';
import { DisplayOnlyTag } from '../utils/types';
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
  tags: Array<DisplayOnlyTag>;
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
        <TagWithContextMenu
          key={tag._id}
          tag={tag}
          size={size}
          noteId={noteId}
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

export default React.memo(Tags);
