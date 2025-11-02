import { gql } from '@apollo/client'
import { CombinedGraphQLErrors } from '@apollo/client/errors'
import { useMutation } from '@apollo/client/react'
import { useCallback, useState } from 'react'
import type {
  AddLinkMutation,
  AddLinkMutationVariables,
  AddTagByNameToNoteMutation,
  AddTagByNameToNoteMutationVariables,
  AddTextMutation,
  AddTextMutationVariables,
  CreateTagMutation,
  CreateTagMutationVariables,
  Link,
  Note,
  Tag,
} from '../generated/graphql'
import {
  ADD_LINK_MUTATION,
  ADD_TAG_BY_NAME_TO_NOTE_MUTATION,
  ADD_TEXT_MUTATION,
  BASE_TAG_FRAGMENT,
} from '../utils/sharedQueriesAndFragments'

export interface ExportFile {
  user: {
    name: string
  }
  notes: Array<Note>
  tags: Array<Tag>
  meta: {
    exportedFrom: string
    exportedAt: Date
    fileSize: number
  }
}

interface CurrentImport {
  entityName: string
  progress: number
}

export const IMPORT_COMPLETE = 'IMPORT_COMPLETE'

const CREATE_TAG_MUTATION = gql`
  mutation CreateTag($name: String!, $color: String) {
    createTag(name: $name, color: $color) {
      ...BaseTag
    }
  }
  ${BASE_TAG_FRAGMENT}
`

export const useDataImport = () => {
  const [currentImport, setCurrentImport] = useState<
    CurrentImport | typeof IMPORT_COMPLETE | null
  >(null)

  const [createTag] = useMutation<
    CreateTagMutation,
    CreateTagMutationVariables
  >(CREATE_TAG_MUTATION)
  const [addLinkNote] = useMutation<AddLinkMutation, AddLinkMutationVariables>(
    ADD_LINK_MUTATION,
  )
  const [addTextNote] = useMutation<AddTextMutation, AddTextMutationVariables>(
    ADD_TEXT_MUTATION,
  )
  const [addTagByNameToNote] = useMutation<
    AddTagByNameToNoteMutation,
    AddTagByNameToNoteMutationVariables
  >(ADD_TAG_BY_NAME_TO_NOTE_MUTATION)

  const doImport = useCallback(
    (importData: ExportFile) => {
      ;(async () => {
        const stats = {
          tags: {
            imported: 0,
            duplicate: 0,
          },
          notes: {
            imported: 0,
            tagged: 0,
          },
        }
        const tagIdNameMap: { [tagId: string]: string } = {}
        for (const tagIndex in importData.tags) {
          const tag: Tag = importData.tags[tagIndex]
          tagIdNameMap[tag._id] = tag.name
          try {
            await createTag({
              variables: { name: tag.name, color: tag.color },
            })
            stats.tags.imported += 1
          } catch (exception) {
            if (
              CombinedGraphQLErrors.is(exception) &&
              exception.errors.some((e) => e.message.includes('already exists'))
            ) {
              stats.tags.duplicate += 1
            } else {
              throw exception
            }
          }

          setCurrentImport({
            entityName: 'tags',
            progress: parseInt(tagIndex) / importData.tags.length,
          })
        }

        for (const noteIndex in importData.notes) {
          const note = importData.notes[noteIndex]
          let createdNote
          if ((note.type as string) === 'Link') {
            const { url, name, description } = note as Link
            createdNote = (
              await addLinkNote({
                variables: { url, title: name, description },
              })
            ).data!.submitLink
          } else {
            const { name, description } = note
            createdNote = (
              await addTextNote({
                variables: { title: name, description },
              })
            ).data!.createText
          }

          stats.notes.imported += 1

          for (const tag of note.tags) {
            const tagName = tagIdNameMap[tag as any] // tags are only imported as ID references (string)
            await addTagByNameToNote({
              variables: { noteId: createdNote._id, tagName },
            })
            stats.notes.tagged += 1
          }

          setCurrentImport({
            entityName: 'notes',
            progress: parseInt(noteIndex) / importData.notes.length,
          })
        }

        // todo: consider passing this to setCurrentImport (= returning) somehow
        alert(
          `Imported ${stats.tags.imported} tags ` +
            `(skipped ${stats.tags.duplicate} tags already present) ` +
            `and ${stats.notes.imported} notes ` +
            `(with ${stats.notes.tagged} tags total)`,
        )
        setCurrentImport(IMPORT_COMPLETE)
      })()
    },
    [setCurrentImport],
  )
  const clearImport = useCallback(() => {
    setCurrentImport(null)
  }, [setCurrentImport])

  return {
    currentImport,
    doImport,
    clearImport,
  }
}
