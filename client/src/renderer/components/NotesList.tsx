import React from 'react';
import { NotesForListQuery } from '../generated/graphql';
import Centered from './Centered';
import Gap from './Gap';
import NoteInList from './NoteInList';

const NotesList: React.FC<{
  notes: NotesForListQuery['notes'];
  expanded: boolean;
}> = ({ notes, expanded }) => {
  if (notes.length === 0) {
    // todo: style
    // todo: offer to reset search
    return <Centered>Nothing here.</Centered>;
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
