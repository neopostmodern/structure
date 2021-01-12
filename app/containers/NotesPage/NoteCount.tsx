import React from 'react'

import { ArchiveState } from '../../actions/userInterface'
import { NoteObject } from '../../reducers/links'

interface NoteCountProps {
  notes: Array<NoteObject>
  matchedNotes?: Array<NoteObject>
  archivedMatchedNotesCount?: number
  archiveState: ArchiveState
}

const NoteCount: React.FC<NoteCountProps> = ({
  notes,
  matchedNotes,
  archiveState,
  archivedMatchedNotesCount,
}) => {
  if (notes && matchedNotes) {
    const archivedNotesCount = notes.filter((note) => Boolean(note.archivedAt))
      .length
    let displayableNoteCount = notes.length
    let totalNotes = displayableNoteCount.toString()
    if (archiveState === ArchiveState.ONLY_ARCHIVE) {
      displayableNoteCount = archivedNotesCount
      totalNotes = `(${
        notes.length - archivedNotesCount
      }+) ${archivedNotesCount}`
    } else if (archiveState === ArchiveState.NO_ARCHIVE) {
      displayableNoteCount = notes.length - archivedNotesCount
      totalNotes = `${
        notes.length - archivedNotesCount
      } (+${archivedNotesCount})`
    }
    if (matchedNotes.length === displayableNoteCount) {
      return totalNotes
    }

    let matchedNotesCount = matchedNotes.length.toString()
    if (archiveState === ArchiveState.ONLY_ARCHIVE) {
      matchedNotesCount = `(${
        matchedNotes.length - archivedMatchedNotesCount
      }+) ${archivedMatchedNotesCount}`
    } else if (archiveState === ArchiveState.NO_ARCHIVE) {
      if (archivedMatchedNotesCount && archivedMatchedNotesCount > 0) {
        matchedNotesCount = `${matchedNotes.length} (+${archivedMatchedNotesCount})`
      }
    }

    return `${matchedNotesCount} / ${totalNotes}`
  }
  return null
}

export default NoteCount
