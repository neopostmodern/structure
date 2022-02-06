import styled from 'styled-components';
import { ExternalLink, InlineButton, InternalLink } from './CommonStyles';

export const NotesContainer = styled.div`
  padding-top: 2rem;
`;

export const Note = styled.div<{ archived: boolean }>`
  margin-bottom: 2rem;
  display: flex;
  opacity: ${({ archived }): number => (archived ? 0.5 : 1)};
`;

export const NoteContainer = styled.div`
  min-width: 0;
  width: 100%;
`;

export const NoteTitleLine = styled.div`
  display: flex;
`;

export const NoteTitleLink = styled(InternalLink)`
  color: inherit;
  margin-bottom: 0.3em;
  font-size: 130%;
`;

export const NoteAddedDate = styled.div`
  flex-shrink: 0;

  margin-top: 0.2rem;
  margin-left: auto;
  padding-left: 0.5rem;
  color: gray;
  font-size: 80%;
`;

export const NoteInfo = styled.div`
  display: flex;
  color: gray;
  margin-bottom: 0.2em;
`;

export const NoteDescription = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const NoteActions = styled.div`
  display: flex;
  align-items: center;
`;

export const NoteTypeBadge = styled.div`
  margin-left: 0.5rem;
  margin-top: 0.3rem;
  font-family: monospace;
  text-transform: lowercase;
`;

export const LinkDomain = styled(ExternalLink)`
  min-width: 10em;
  color: inherit;
`;

export const ArchiveActionWrapper = styled.div`
  margin-left: auto;
`;

export const ArchiveStatus = styled.div`
  ${Note}:hover & {
    display: none;
  }
`;
export const ArchiveButton = styled(InlineButton)`
  display: none;

  ${Note}:hover & {
    display: block;
  }
`;

export const CheckboxLabel = styled.label`
  font-size: 1.5rem;
  margin-right: 0.5rem;
  margin-top: -0.3rem;
`;
export const Checkbox = styled.input`
  display: none;
`;
