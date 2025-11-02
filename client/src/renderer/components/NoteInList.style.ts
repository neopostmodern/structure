import { Button, keyframes } from '@mui/material'
import styled from 'styled-components'
import { OPTIMISTIC_NOTE_COUNT } from '../containers/NotesPage/NotesPage'
import { ExternalLink, InternalLink } from './CommonStyles'
import UserAvatar from './UserAvatar'

const appearAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: var(--opacity);
  }
`

export const Note = styled.div<{ archived: boolean }>`
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  --opacity: ${({ archived }): number => (archived ? 0.5 : 1)};

  animation: ${appearAnimation} 0.1s ease-in-out;
  animation-fill-mode: both;
  ${() =>
    [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
      .map(
        (index) => `
          &:nth-child(${index}) {
            animation-delay: ${
              (index > OPTIMISTIC_NOTE_COUNT
                ? index - (OPTIMISTIC_NOTE_COUNT + 1)
                : index) * 0.015
            }s;
          }
        `,
      )
      .join('\n')}
`

export const NoteContainer = styled.div`
  min-width: 0;
  width: 100%;
`

export const NoteTitleLine = styled.div`
  display: flex;
`

export const NoteTitleLink = styled(InternalLink)`
  color: inherit;
  font-size: 130%;
  overflow-x: hidden;
  text-overflow: ellipsis;
`

export const UserContainer = styled.div`
  margin-left: auto;
  padding-left: 1em;
  margin-top: 0.1rem;
`
export const SmallUserAvatar = styled(UserAvatar)`
  height: 1.8em;
  width: 1.8em;
  font-size: 80%;
`

export const NoteAddedDate = styled.div`
  flex-shrink: 0;

  margin-top: 0.2rem;
  padding-left: 0.5rem;
  color: gray;
  font-size: 80%;
`

export const NoteInfo = styled.div`
  display: flex;
  color: gray;
  margin-bottom: 0.2em;
`

export const NoteDescription = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const NoteActions = styled.div`
  display: flex;
  align-items: center;
`

export const NoteTypeBadge = styled.div`
  margin-left: 0.5rem;
  margin-top: 0.3rem;
  font-family: monospace;
  text-transform: lowercase;
`

export const LinkDomain = styled(ExternalLink)`
  min-width: 10em;
  color: inherit;
`

export const ActionMenuWrapper = styled.div`
  margin-left: auto;
`

export const ArchiveStatus = styled.div`
  ${Note}:hover & {
    display: none;
  }
`
export const ArchiveButton = styled(Button)`
  opacity: 0;
  pointer-events: none;

  transition: opacity 0.2s ease-in-out;

  ${Note}:hover & {
    opacity: 1;
    pointer-events: initial;
  }
`

export const CheckboxLabel = styled.label`
  font-size: 1.5rem;
  margin-right: 0.5rem;
  margin-top: -0.3rem;
`
export const Checkbox = styled.input`
  display: none;
`
