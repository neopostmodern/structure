import React, { useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import marked from 'marked'
import Mousetrap from 'mousetrap'
import styled from 'styled-components'

import makeMousetrapGlobal from '../utils/mousetrapGlobal'
import shortcutKeysToString from '../utils/shortcutKeysToString'

import { DescriptionTextarea } from './formComponents'
import { InlineButton } from './CommonStyles'

makeMousetrapGlobal(Mousetrap)

const renderer = new marked.Renderer()
renderer.listitem = (text: string): string => {
  if (/^\s*\[[x ]\]\s*/.test(text)) {
    const textWithListItems = text
      .replace(/^\s*\[ \]\s*/, '☐ ')
      .replace(/^\s*\[x\]\s*/, '☑ ')
    return `<li style="list-style: none; margin-left: -1.3rem;">${textWithListItems}</li>`
  }
  return `<li>${text}</li>`
}

renderer.link = (href: string, title: string, text: string): string =>
  `<a href="${href}" title="${
    title || href
  }" target="_blank" rel="noopener noreferrer">${text}</a>`

marked.setOptions({
  breaks: true,
  renderer,
})

const markedTextareaPadding = '1rem'

const TextareaContainer = styled.div`
  position: relative;
  margin-top: 2px;
  min-height: 3rem;
`

const EmptyTextarea = styled.div`
  border: 1px dashed gray;
  color: gray;

  text-align: center;
  padding-top: 1.5rem;
  padding-bottom: 1.3rem;
`

const EditButton = styled(InlineButton)`
  position: absolute;
  top: ${markedTextareaPadding};
  right: ${markedTextareaPadding};

  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none;

  .textareaContainer:hover & {
    opacity: 1;
    pointer-events: all;
  }
`

const focusDescriptionShortcutKeys = ['ctrl+e', 'command+e']

type MarkedTextareaProps = {
  name: string
}

const MarkedTextarea: React.FC<MarkedTextareaProps> = ({ name }) => {
  const { watch, register } = useFormContext()
  const textareaElement = useRef<HTMLTextAreaElement>()
  const [editDescription, setEditDescription] = useState(false)

  const focusTextarea = (): void => {
    if (document.activeElement !== textareaElement.current) {
      // eslint-disable-next-line no-unused-expressions
      textareaElement.current?.focus()
    }
  }

  const toggleEditDescription = (): void => {
    const currentEditDescriptionStatus = editDescription
    setEditDescription(!currentEditDescriptionStatus)

    if (!currentEditDescriptionStatus) {
      focusTextarea()
    }
  }

  useEffect(() => {
    Mousetrap.bindGlobal(focusDescriptionShortcutKeys, toggleEditDescription)
    return (): void => {
      Mousetrap.unbind(focusDescriptionShortcutKeys)
    }
  })

  let content
  if (editDescription) {
    // todo: check if more props from input need to be passed
    content = (
      <DescriptionTextarea
        name={name}
        ref={(ref): void => {
          textareaElement.current = ref
          register(ref)
        }}
      />
    )
  } else {
    const textContent = watch(name)
    if (textContent && textContent.length) {
      content = (
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: marked(textContent) }}
          style={{ fontSize: '1rem' }}
        />
      )
    } else {
      content = <EmptyTextarea>No content</EmptyTextarea>
    }
  }

  return (
    <TextareaContainer>
      <EditButton
        type='button'
        onClick={toggleEditDescription}
        title={shortcutKeysToString(focusDescriptionShortcutKeys)}
      >
        {editDescription ? 'Done' : 'Edit'}
      </EditButton>
      {content}
    </TextareaContainer>
  )
}

export default MarkedTextarea
