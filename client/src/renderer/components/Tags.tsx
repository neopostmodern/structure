import { gql } from '@apollo/client'
import { Skeleton } from '@mui/material'
import { INTERNAL_TAG_PREFIX } from '@structure/common'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import useHasPermission from '../hooks/useHasPermission'
import useIsOnline from '../hooks/useIsOnline'
import deferUntilIdle from '../utils/deferUntilIdle'
import { BASE_TAG_FRAGMENT } from '../utils/sharedQueriesAndFragments'
import { DisplayOnlyTag } from '../utils/types'
import AddTagButtonOrForm from './AddTagButtonOrForm'
import TagWithContextMenu from './TagWithContextMenu'

export const REMOVE_TAG_MUTATION = gql`
  mutation RemoveTagByIdFromNote($noteId: ID!, $tagId: ID!) {
    removeTagByIdFromNote(noteId: $noteId, tagId: $tagId) {
      ... on INote {
        _id
        updatedAt
        user {
          _id
        }
        tags {
          ...BaseTag

          notes {
            ... on INote {
              _id
            }
          }
        }
      }
    }
  }
  ${BASE_TAG_FRAGMENT}
`

const TagContainer = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(1)};
`

interface TagsProps {
  tags: Array<DisplayOnlyTag>
  noteId: string
  withShortcuts?: boolean
  size?: 'small' | 'medium'
}

const Tags: React.FC<TagsProps> = ({
  tags,
  noteId,
  size,
  withShortcuts = false,
}) => {
  const readOnly = !useHasPermission({ tags }, 'notes', 'write')
  const isOnline = useIsOnline()

  const [showSkeleton, setShowSkeleton] = useState(true)
  useEffect(() => {
    deferUntilIdle(() => setShowSkeleton(false), 1000)
  }, [setShowSkeleton])

  if (showSkeleton) {
    return (
      <TagContainer>
        {tags.map((tag) => (
          <Skeleton key={tag._id} variant='text' height={'2.2rem'}>
            <div>{tag.name}</div>
          </Skeleton>
        ))}
      </TagContainer>
    )
  }

  return (
    <TagContainer>
      {tags
        .filter((tag) => !tag.name.startsWith(INTERNAL_TAG_PREFIX))
        .map((tag) => (
          <TagWithContextMenu
            key={tag._id}
            tag={tag}
            size={size}
            noteId={noteId}
            noteReadOnly={readOnly}
          />
        ))}
      {!readOnly && isOnline && (
        <AddTagButtonOrForm
          withShortcuts={withShortcuts}
          noteId={noteId}
          currentTags={tags}
        />
      )}
    </TagContainer>
  )
}

export default React.memo(Tags)
