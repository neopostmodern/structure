import { FormatListNumberedRtl } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import {
  NoteTextCountMode,
  setNoteTextCountMode,
} from '../actions/userInterface'
import { useNoteTextStats } from '../contexts/NoteTextStatsContext'
import { RootState } from '../reducers'

const TruncatedLabel = styled.span`
  overflow: hidden;
  min-width: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const countWords = (text: string): number =>
  text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length

const NoteTextCounts = () => {
  const stats = useNoteTextStats()
  const mode = useSelector<RootState, NoteTextCountMode>(
    (state) => state.userInterface.noteTextCountMode,
  )
  const dispatch = useDispatch()

  const toggleMode = () => {
    dispatch(
      setNoteTextCountMode(
        mode === NoteTextCountMode.CHARACTERS
          ? NoteTextCountMode.WORDS
          : NoteTextCountMode.CHARACTERS,
      ),
    )
  }

  const isSelection = stats.selectedText.length > 0
  const activeText = isSelection ? stats.selectedText : stats.fullText

  const count =
    mode === NoteTextCountMode.CHARACTERS
      ? activeText.length
      : countWords(activeText)
  const unit =
    mode === NoteTextCountMode.CHARACTERS
      ? count === 1
        ? 'character'
        : 'characters'
      : count === 1
        ? 'word'
        : 'words'

  const originHint =
    stats.textOrigin === 'rendered' ? 'rendered text' : 'raw markdown'

  return (
    <Button
      startIcon={<FormatListNumberedRtl />}
      onClick={toggleMode}
      sx={{ maxWidth: '100%' }}
    >
      <TruncatedLabel>
        {count} {unit} {isSelection ? ' selected' : ''}{' '}
        {mode === NoteTextCountMode.CHARACTERS && `(${originHint})`}
      </TruncatedLabel>
    </Button>
  )
}

export default NoteTextCounts
