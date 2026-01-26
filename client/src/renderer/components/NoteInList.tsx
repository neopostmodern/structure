import { gql } from '@apollo/client'
import { useFragment } from '@apollo/client/react'
import React, { lazy } from 'react'
import TimeAgo from 'react-timeago'
import { NoteInListFragment } from '../generated/graphql'
import useUserId from '../hooks/useUserId'
import logger from '../utils/logger'
import { noteUrl } from '../utils/routes'
import {
  BASE_TAG_FRAGMENT,
  BASE_USER_FRAGMENT,
} from '../utils/sharedQueriesAndFragments'
import suspenseWrap from '../utils/suspenseWrap'
import * as Styled from './NoteInList.style'
import NoteInListBatchEditing from './NoteInListBatchEditing'
import NotesListActionMenu from './NotesListActionMenu'
import Tags from './Tags'
import TooltipWithShortcut from './TooltipWithShortcut'

const RenderedMarkdown = suspenseWrap(
  lazy(() => import(/* webpackPrefetch: true */ './RenderedMarkdown')),
)

export const NoteInList: React.FC<{
  noteId: string
  expanded: boolean
  shortcut?: Array<string>
}> = ({ noteId, expanded, shortcut }) => {
  const userId = useUserId()

  const noteData = useFragment<NoteInListFragment>({
    fragment: gql`
      fragment NoteInList on Note {
        _id
        name
        url
        domain
        createdAt
        updatedAt
        changedAt
        archivedAt
        deletedAt
        description
        tags {
          ...BaseTag
        }
        user {
          ...BaseUser
        }
      }
      ${BASE_USER_FRAGMENT}
      ${BASE_TAG_FRAGMENT}
    `,
    fragmentName: 'NoteInList',
    from: {
      __typename: 'Note',
      _id: noteId,
    },
  })
  if (noteData.dataState === 'partial') {
    logger.error(
      `[NoteInList] Partial data received from cache for note '${noteId}'. Missing data:`,
      noteData.missing,
    )
    throw Error('[NoteInList] Received partial data.')
  }

  const note = noteData.data

  return (
    <Styled.Note archived={Boolean(note.archivedAt)}>
      <NoteInListBatchEditing noteId={note._id} />
      <Styled.NoteContainer>
        <Styled.NoteTitleLine>
          <TooltipWithShortcut title='' shortcut={shortcut} placement='left'>
            <Styled.NoteTitleLink to={noteUrl(note._id)}>
              {note.name}
            </Styled.NoteTitleLink>
          </TooltipWithShortcut>
          {!note.url && (
            <Styled.NoteTypeBadge>&lt;text&gt;</Styled.NoteTypeBadge>
          )}
          <Styled.UserContainer>
            {note.user._id !== userId && (
              <Styled.SmallUserAvatar user={note.user} />
            )}
          </Styled.UserContainer>
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
              title={note.url}
            >
              {note.domain}
            </Styled.LinkDomain>
          )}
          {!expanded && (
            <Styled.NoteDescription>{note.description}</Styled.NoteDescription>
          )}
        </Styled.NoteInfo>
        <Styled.NoteActions>
          <Tags tags={note.tags} noteId={note._id} />
          <Styled.ActionMenuWrapper>
            <NotesListActionMenu note={note} />
          </Styled.ActionMenuWrapper>
        </Styled.NoteActions>
        {expanded && (
          <RenderedMarkdown markdown={note.description} showEmpty={false} />
        )}
      </Styled.NoteContainer>
    </Styled.Note>
  )
}

export default React.memo(NoteInList)
