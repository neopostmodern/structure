import { ArchiveState } from '../actions/userInterface'

interface NoteForCount {
  archivedAt: unknown
}

const noteCountsWithSearchMatchesString = ({
  notes,
  matchedNotes,
  archiveState,
  archivedMatchedNotesCount,
}: {
  notes: Array<NoteForCount>
  matchedNotes?: Array<NoteForCount>
  archivedMatchedNotesCount?: number
  archiveState: ArchiveState
}) => {
  if (notes && matchedNotes) {
    const archivedNotesCount = notes.filter((note) =>
      Boolean(note.archivedAt),
    ).length
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

export default noteCountsWithSearchMatchesString
