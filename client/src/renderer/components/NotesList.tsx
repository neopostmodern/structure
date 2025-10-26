import { AddCircle, Create } from '@mui/icons-material';
import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import type { NotesForListQuery } from '../generated/graphql';
import useQuickNumberShortcuts from '../hooks/useQuickNumberShortcuts';
import { QUICK_ACCESS_SHORTCUT_PREFIX, SHORTCUTS } from '../utils/keyboard';
import { noteUrl } from '../utils/routes';
import EmptyPageInfo from './EmptyPageInfo';
import Gap from './Gap';
import NoteInList from './NoteInList'; // todo
import NoteTest from '../components/NoteTest';
import Shortcut from './Shortcut';
import TestInView from './TestInView';

const NotesList: React.FC<{
  noteIds: Array<string>;
  expanded: boolean;
  initialCount: number;
}> = ({ noteIds, expanded, initialCount }) => {
  const dispatch = useDispatch();
  // todo
  // useQuickNumberShortcuts(notes, (note) => {
  //   dispatch(push(noteUrl(note)));
  // });

  const [notesLimit, setNotesLimit] = useState(initialCount);
  const handleIsInView = useCallback(
    () => setNotesLimit((limit) => limit + 10),
    [setNotesLimit],
  );

  if (noteIds.length === 0) {
    return (
      <EmptyPageInfo
        icon={Create}
        title="A blank page"
        subtitle={
          <>
            You can add a new note by hitting the{' '}
            <AddCircle
              color="primary"
              fontSize="inherit"
              style={{ position: 'relative', top: '0.2em' }}
            />{' '}
            or using the shortcut{' '}
            <Shortcut shortcuts={SHORTCUTS.NEW_NOTE_PAGE}></Shortcut>
          </>
        }
      />
    );
  }

  return (
    <>
      <Gap vertical={1} />
      <div>
        {noteIds.slice(0, notesLimit).map((noteId, noteIndex) => (
          <NoteTest key={noteId} noteId={noteId} expanded={expanded} />
        ))}
        {noteIds.length > notesLimit && (
          <TestInView onIsInView={handleIsInView} />
        )}
      </div>
    </>
  );
};

export default React.memo(NotesList);
