import React from 'react';
import { ArchiveState } from '../../actions/userInterface';
import { NotesForListQuery } from '../../generated/graphql';

interface NoteCountProps {
  notes: NotesForListQuery['notes'];
  matchedNotes?: NotesForListQuery['notes'];
  archivedMatchedNotesCount?: number;
  archiveState: ArchiveState;
}

const NoteCount: React.FC<NoteCountProps> = ({
  notes,
  matchedNotes,
  archiveState,
  archivedMatchedNotesCount,
}) => {
  if (notes && matchedNotes) {
    const archivedNotesCount = notes.filter((note) =>
      Boolean(note.archivedAt)
    ).length;
    let displayableNoteCount = notes.length;
    let totalNotes = displayableNoteCount.toString();
    if (archiveState === ArchiveState.ONLY_ARCHIVE) {
      displayableNoteCount = archivedNotesCount;
      totalNotes = `(${
        notes.length - archivedNotesCount
      }+) ${archivedNotesCount}`;
    } else if (archiveState === ArchiveState.NO_ARCHIVE) {
      displayableNoteCount = notes.length - archivedNotesCount;
      totalNotes = `${
        notes.length - archivedNotesCount
      } (+${archivedNotesCount})`;
    }
    if (matchedNotes.length === displayableNoteCount) {
      return <>{totalNotes}</>;
    }

    let matchedNotesCount = matchedNotes.length.toString();
    if (archiveState === ArchiveState.ONLY_ARCHIVE) {
      matchedNotesCount = `(${
        matchedNotes.length - archivedMatchedNotesCount
      }+) ${archivedMatchedNotesCount}`;
    } else if (archiveState === ArchiveState.NO_ARCHIVE) {
      if (archivedMatchedNotesCount && archivedMatchedNotesCount > 0) {
        matchedNotesCount = `${matchedNotes.length} (+${archivedMatchedNotesCount})`;
      }
    }

    return (
      <>
        {matchedNotesCount} / {totalNotes}
      </>
    );
  }
  return <>&nbsp;</>;
};

export default NoteCount;
