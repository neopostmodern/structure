import React from 'react'
import TimeAgo from 'react-timeago'
import { gql, useMutation } from '@apollo/client'

import { NoteObject } from '../reducers/links'
import Tags from './Tags'

import { BatchSelectionType } from '../reducers/userInterface'
import {
  ToggleArchivedNote,
  ToggleArchivedNoteVariables,
} from '../generated/ToggleArchivedNote'

import * as Styled from './NotesList.style'
import Centered from './Centered'

const TOGGLE_ARCHIVED_MUTATION = gql`
  mutation ToggleArchivedNote($noteId: ID!) {
    toggleArchivedNote(noteId: $noteId) {
      ... on INote {
        _id
        archivedAt
      }
    }
  }
`

type BatchEditingProps =
  | {
      batchEditing: boolean
      batchSelections: BatchSelectionType
      onSetBatchSelected: (noteId: string, selected: boolean) => void
    }
  | {}

type NotesListProps = {
  notes: Array<NoteObject>
} & BatchEditingProps

const NotesList: React.FC<NotesListProps> = ({ notes, ...props }) => {
  const [toggleArchivedNote] = useMutation<
    ToggleArchivedNote,
    ToggleArchivedNoteVariables
  >(TOGGLE_ARCHIVED_MUTATION)

  if (notes.length === 0) {
    // todo: style
    // todo: offer to reset search
    return <Centered>Nothing here.</Centered>
  }

  return (
    <Styled.NotesContainer>
      {notes.map((note) => (
        <Styled.Note key={note._id} archived={Boolean(note.archivedAt)}>
          {'batchEditing' in props && props.batchEditing === true && (
            <Styled.CheckboxLabel>
              {props.batchSelections[note._id] ? '☒' : '☐'}

              <Styled.Checkbox
                type='checkbox'
                checked={props.batchSelections[note._id]}
                onChange={(event): void => {
                  props.onSetBatchSelected(note._id, event.target.checked)
                }}
              />
            </Styled.CheckboxLabel>
          )}
          <Styled.NoteContainer>
            <Styled.NoteTitleLine>
              <Styled.NoteTitleLink
                to={`/${note.__typename.toLowerCase()}s/${note._id}`}
              >
                {note.name}
              </Styled.NoteTitleLink>
              {note.__typename !== 'Link' && (
                <Styled.NoteTypeBadge>
                  &lt;
                  {note.__typename.toLowerCase()}
                  &gt;
                </Styled.NoteTypeBadge>
              )}
              <Styled.NoteAddedDate>
                <TimeAgo date={note.createdAt} />
              </Styled.NoteAddedDate>
            </Styled.NoteTitleLine>
            <Styled.NoteInfo>
              {note.url && (
                <Styled.LinkDomain
                  href={note.url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {note.domain}
                </Styled.LinkDomain>
              )}
              <Styled.NoteDescription>
                {note.description}
              </Styled.NoteDescription>
            </Styled.NoteInfo>
            <Styled.NoteActions>
              <Tags tags={note.tags} noteId={note._id} />
              <Styled.ArchiveActionWrapper>
                <Styled.ArchiveStatus>
                  {note.archivedAt && 'Archived'}
                </Styled.ArchiveStatus>
                <Styled.ArchiveButton
                  type='button'
                  onClick={(): void => {
                    toggleArchivedNote({ variables: { noteId: note._id } })
                  }}
                >
                  {note.archivedAt ? 'Unarchive' : 'Archive'}
                </Styled.ArchiveButton>
              </Styled.ArchiveActionWrapper>
            </Styled.NoteActions>
          </Styled.NoteContainer>
        </Styled.Note>
      ))}
    </Styled.NotesContainer>
  )
}

export default NotesList
