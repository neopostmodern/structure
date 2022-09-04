import { AddCircle, Create } from '@mui/icons-material';
import React from 'react';
import { NotesForListQuery } from '../generated/graphql';
import EmptyPageInfo from './EmptyPageInfo';
import Gap from './Gap';
import NoteInList from './NoteInList';
import Shortcut from './Shortcut';

const NotesList: React.FC<{
  notes: NotesForListQuery['notes'];
  expanded: boolean;
}> = ({ notes, expanded }) => {
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
            <Shortcut ctrlOrCommand canHotkey>
              N
            </Shortcut>
          </>
        }
      />
    );
  }

  return (
    <>
      <Gap vertical={1} />
      {notes.map((note) => (
        <NoteInList key={note._id} note={note} expanded={expanded} />
      ))}
    </>
  );
};

export default React.memo(NotesList);
