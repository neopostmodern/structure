import React, { lazy } from 'react';
import TimeAgo from 'react-timeago';
import { gql } from 'graphql-tag';
import type { NotesForListQuery } from '../generated/graphql';
import useUserId from '../hooks/useUserId';
import { noteUrl } from '../utils/routes';
import suspenseWrap from '../utils/suspenseWrap';
import * as Styled from './NoteInList.style';
import NoteInListBatchEditing from './NoteInListBatchEditing';
import NotesListActionMenu from './NotesListActionMenu';
import Tags from './Tags';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reducers';
import { UserInterfaceStateType } from '../reducers/userInterface';
import TooltipWithShortcut from './TooltipWithShortcut';
import { useFragment } from '@apollo/client/react';
import {
  BASE_NOTE_FRAGMENT,
  BASE_TAG_FRAGMENT,
  BASE_USER_FRAGMENT,
} from '../utils/sharedQueriesAndFragments';

const RenderedMarkdown = suspenseWrap(
  lazy(() => import(/* webpackPrefetch: true */ './RenderedMarkdown')),
);

export const NoteTest: React.FC<{
  noteId: string; // NotesForListQuery['notes'][number];
  expanded: boolean;
  shortcut?: Array<string>;
}> = ({ noteId, expanded, shortcut }) => {
  const userId = useUserId();
  const noteData = useFragment({
    fragment: gql`
      fragment TestNote on INote {
        ... on INote {
          # type
          _id
          name
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
        ... on Link {
          url
          domain
        }
      }
      ${BASE_USER_FRAGMENT}
      ${BASE_TAG_FRAGMENT}
    `,
    fragmentName: 'TestNote',
    from: {
      __typename: 'Text',
      _id: noteId,
    },
  });
  const note = noteData.data;

  const { searchQuery } = useSelector<RootState, UserInterfaceStateType>(
    (state) => state.userInterface,
  );
  console.log(note, searchQuery);

  if (searchQuery) {
    if (
      !note.name.includes(searchQuery) &&
      !note.tags.some((tag) => tag.name.includes(searchQuery))
    ) {
      return null;
    }
  }

  return (
    <Styled.Note archived={Boolean(note.archivedAt)}>
      <NoteInListBatchEditing noteId={note._id} />
      <Styled.NoteContainer>
        <Styled.NoteTitleLine>
          <TooltipWithShortcut title="" shortcut={shortcut} placement="left">
            <Styled.NoteTitleLink to={noteUrl(note)}>
              {note.name}
            </Styled.NoteTitleLink>
          </TooltipWithShortcut>
          {note.__typename !== 'Link' && (
            <Styled.NoteTypeBadge>
              &lt;
              {note.__typename.toLowerCase()}
              &gt;
            </Styled.NoteTypeBadge>
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
          {'url' in note && (
            <Styled.LinkDomain
              href={note.url}
              target="_blank"
              rel="noopener noreferrer"
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
  );
};

export default NoteTest;
