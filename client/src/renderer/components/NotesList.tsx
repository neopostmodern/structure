import { AddCircle, Create } from '@mui/icons-material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import { NotesForListQuery } from '../generated/graphql';
import useQuickNumberShortcuts from '../hooks/useQuickNumberShortcuts';
import { QUICK_ACCESS_SHORTCUT_PREFIX, SHORTCUTS } from '../utils/keyboard';
import { noteUrl } from '../utils/routes';
import EmptyPageInfo from './EmptyPageInfo';
import Gap from './Gap';
import NoteInList from './NoteInList';
import Shortcut from './Shortcut';

const NotesList: React.FC<{
  notes: NotesForListQuery['notes'];
  expanded: boolean;
}> = ({ notes, expanded }) => {
  const dispatch = useDispatch();
  useQuickNumberShortcuts(notes, (note) => {
    dispatch(push(noteUrl(note)));
  });

  if (notes.length === 0) {
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
        {notes.map((note, noteIndex) => (
          <NoteInList
            key={note._id}
            note={note}
            expanded={expanded}
            shortcut={
              SHORTCUTS[`${QUICK_ACCESS_SHORTCUT_PREFIX}${noteIndex + 1}`]
            }
          />
        ))}
      </div>
    </>
  );
};

export default React.memo(NotesList);
