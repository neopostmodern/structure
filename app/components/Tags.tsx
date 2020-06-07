import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { gql, useMutation } from '@apollo/client'
import Mousetrap from 'mousetrap'
import makeMousetrapGlobal from '../utils/mousetrapGlobal'

import { TagType } from '../types'
import InlineTagForm from './InlineTagForm'
import colorTools from '../utils/colorTools'

import Tag, { BaseTag } from './Tag'
import {
  AddTagByNameToNote,
  AddTagByNameToNoteVariables,
} from '../generated/AddTagByNameToNote'
import {
  RemoveTagByIdFromNote,
  RemoveTagByIdFromNoteVariables,
} from '../generated/RemoveTagByIdFromNote'

makeMousetrapGlobal(Mousetrap)

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
`

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
`

const tagShortcutKeys = ['ctrl+t', 'command+t']

const TagContainer = styled.div`
  display: flex;
`

interface TagsProps {
  tags: Array<TagType>
  noteId: string
  withShortcuts?: boolean
}

const Tags: React.FC<TagsProps> = ({ tags, noteId, withShortcuts = false }) => {
  const [addingNew, setAddingNew] = useState<boolean>(false)

  // todo: show loading indicator
  const [addTagToNote] = useMutation<
    AddTagByNameToNote,
    AddTagByNameToNoteVariables
  >(ADD_TAG_MUTATION)

  const [removeTagFromNote] = useMutation<
    RemoveTagByIdFromNote,
    RemoveTagByIdFromNoteVariables
  >(REMOVE_TAG_MUTATION)

  const showNewTagForm = (): void => {
    setAddingNew(true)
  }

  const hideNewTagForm = (): void => {
    setAddingNew(false)
  }

  useEffect(() => {
    if (withShortcuts) {
      Mousetrap.bindGlobal(tagShortcutKeys, showNewTagForm)
    }

    return (): void => {
      if (withShortcuts) {
        Mousetrap.unbind(tagShortcutKeys)
      }
    }
  })

  const handleAddTag = (tagName: string): void => {
    const tagValue = tagName.trim()
    if (tagValue.length > 0) {
      addTagToNote({ variables: { noteId, tagName: tagValue } })
      hideNewTagForm()
    } else {
      // eslint-disable-next-line no-undef
      alert("Can't add empty tag.") // todo: error handling in UI
    }
  }

  let newTagForm
  if (addingNew) {
    newTagForm = (
      <InlineTagForm
        tags={tags}
        onAddTag={handleAddTag}
        onAbort={hideNewTagForm}
      />
    )
  } else {
    const addTagText = tags.length === 0 ? '+tag' : '+'
    newTagForm = (
      <BaseTag style={{ border: '1px solid black' }} onClick={showNewTagForm}>
        {addTagText}
      </BaseTag>
    )
  }
  return (
    <TagContainer>
      {tags.map((tag) => (
        <Tag
          key={tag._id}
          tag={tag}
          onContextMenu={(event): void => {
            event.preventDefault()
            removeTagFromNote({ variables: { noteId, tagId: tag._id } })
          }}
          ref={colorTools}
        />
      ))}
      {newTagForm}
    </TagContainer>
  )
}

export default Tags
