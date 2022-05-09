import React from 'react';
import TimeAgo from 'react-timeago';
import { NoteObject } from '../reducers/links';
import * as Styled from './NoteInList.style';
import NoteInListBatchEditing from './NoteInListBatchEditing';
import NotesListActionMenu from './NotesListActionMenu';
import Tags from './Tags';

export const NoteInList: React.FC<
  React.PropsWithChildren<{ note: NoteObject }>
> = ({ note }) => {
  return (
    <Styled.Note archived={Boolean(note.archivedAt)}>
      <NoteInListBatchEditing noteId={note._id} />
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
              target="_blank"
              rel="noopener noreferrer"
            >
              {note.domain}
            </Styled.LinkDomain>
          )}
          <Styled.NoteDescription>{note.description}</Styled.NoteDescription>
        </Styled.NoteInfo>
        <Styled.NoteActions>
          <Tags tags={note.tags} noteId={note._id} />
          <Styled.ActionMenuWrapper>
            <NotesListActionMenu note={note} />
          </Styled.ActionMenuWrapper>
        </Styled.NoteActions>
      </Styled.NoteContainer>
    </Styled.Note>
  );
};

export default React.memo(NoteInList);
