import React from 'react';
import { NoteObject } from '../reducers/links';
import Centered from './Centered';
import Gap from './Gap';
import NoteInList from './NoteInList';

const NotesList: React.FC<{
  notes: Array<NoteObject>;
}> = React.memo(({ notes }) => {
  if (notes.length === 0) {
    // todo: style
    // todo: offer to reset search
    return <Centered>Nothing here.</Centered>;
  }

  return (
    <>
      <Gap vertical={1} />
      {notes.map((note) => (
        <NoteInList key={note._id} note={note} />
      ))}
    </>
  );
});

export default NotesList;
