import { Tab, Tabs, TextField } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import styled from 'styled-components'
import { useNoteTextStatsSetters } from '../contexts/NoteTextStatsContext'
import useShortcut from '../hooks/useShortcut'
import { SHORTCUTS } from '../utils/keyboard'
import RenderedMarkdown from './RenderedMarkdown'

const TextareaContainer = styled.div`
  position: relative;
  margin-top: 2px;
  min-height: 3rem;
`

type MarkedTextareaProps = {
  name: string
  readOnly?: boolean
}

const MarkedTextarea: React.FC<MarkedTextareaProps> = ({ name, readOnly }) => {
  const { control, getValues, watch } = useFormContext()
  const { setFullText, setSelectedText, setTextOrigin } =
    useNoteTextStatsSetters()
  const [editDescription, setEditDescription] = useState(false)
  const [lastSelection, setLastSelection] = useState<[number, number] | null>(
    null,
  )
  const textareaElement = useRef<HTMLTextAreaElement>()
  const viewContainerElement = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isRenderedMode = readOnly || !editDescription

    const storeFullText = (currentDescription: string): void => {
      setTextOrigin(isRenderedMode ? 'rendered' : 'source')
      if (!currentDescription) {
        setFullText('')
      } else if (isRenderedMode) {
        setFullText(viewContainerElement.current?.textContent ?? '')
      } else {
        setFullText(currentDescription)
      }
    }

    storeFullText(getValues(name))

    const subscription = watch((values, { name: changedField }) => {
      if (!changedField || changedField === name) {
        storeFullText(values[name] ?? '')
      }
    })

    return () => subscription.unsubscribe()
  }, [editDescription, readOnly])

  useEffect(() => {
    const handleSelectionChange = (): void => {
      if (
        textareaElement.current &&
        document.activeElement === textareaElement.current
      ) {
        const { selectionStart, selectionEnd, value } = textareaElement.current
        setSelectedText(
          selectionStart !== selectionEnd
            ? value.substring(selectionStart, selectionEnd)
            : '',
        )
        return
      }

      const selection = window.getSelection()
      if (
        selection &&
        selection.toString().length > 0 &&
        selection.anchorNode &&
        viewContainerElement.current?.contains(selection.anchorNode)
      ) {
        setSelectedText(selection.toString())
      } else {
        setSelectedText('')
      }
    }

    document.addEventListener('selectionchange', handleSelectionChange)

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [])

  // shortcuts need self-updating references
  const shortcutRefs = useRef<{
    editDescription: boolean
    lastSelection: [number, number] | null
  }>()
  shortcutRefs.current = { editDescription, lastSelection }

  const focusTextarea = (): void => {
    if (!textareaElement.current) {
      return
    }
    if (document.activeElement !== textareaElement.current) {
      textareaElement.current.focus()
      if (shortcutRefs.current?.lastSelection) {
        textareaElement.current.setSelectionRange(
          ...shortcutRefs.current.lastSelection,
        )
      } else {
        textareaElement.current.setSelectionRange(
          textareaElement.current.value.length,
          textareaElement.current.value.length,
        )
      }
    }
  }

  const toggleEditDescription = (fromShortcut = false): void => {
    if (shortcutRefs.current?.editDescription) {
      if (fromShortcut && document.activeElement !== textareaElement.current) {
        focusTextarea()
      } else {
        if (textareaElement.current) {
          if (fromShortcut) {
            setLastSelection([
              textareaElement.current.selectionStart,
              textareaElement.current.selectionEnd,
            ])
            textareaElement.current.blur()
          } else {
            setLastSelection(null)
          }
        }
        setSelectedText('')
        setEditDescription(false)
      }
    } else {
      setSelectedText('')
      setEditDescription(true)
      setTimeout(() => {
        focusTextarea()
      }, 0)
    }
  }

  useShortcut(SHORTCUTS.EDIT, () => {
    toggleEditDescription(true)
  })

  useEffect(() => {
    if (getValues(name).length === 0 && !editDescription) {
      setEditDescription(true)
    }
  }, [])

  const renderMarkdown = () => (
    <div ref={viewContainerElement}>
      <RenderedMarkdown markdown={getValues(name)} />
    </div>
  )

  if (readOnly) {
    return renderMarkdown()
  }

  return (
    <TextareaContainer>
      <Tabs
        value={editDescription ? 1 : 0}
        onChange={() => {
          toggleEditDescription()
        }}
      >
        <Tab label='View' />
        <Tab label='Edit' disabled={readOnly} />
      </Tabs>
      <div hidden={!editDescription}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <TextField
              multiline
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              hidden={!editDescription}
              value={field.value}
              variant='outlined'
              inputRef={(ref) => {
                field.ref(ref)
                textareaElement.current = ref
              }}
              fullWidth
            />
          )}
        />
      </div>
      {!editDescription && renderMarkdown()}
    </TextareaContainer>
  )
}

export default MarkedTextarea
