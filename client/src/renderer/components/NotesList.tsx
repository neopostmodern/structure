import React from 'react';
import { NoteObject } from '../reducers/links';
import Centered from './Centered';
import Gap from './Gap';
import NoteInList, { NoteBatchEditingProps } from './NoteInList';

const NotesList: React.FC<
  {
    notes: Array<NoteObject>;
  } & NoteBatchEditingProps
> = React.memo(({ notes, ...props }) => {
  if (notes.length === 0) {
    // todo: style
    // todo: offer to reset search
    return <Centered>Nothing here.</Centered>;
  }

  return (
    <>
      <Gap vertical={1} />
      {notes.map((note) => (
        <NoteInList key={note._id} note={note} {...props} />
      ))}
    </>
  );
});

export default NotesList;
