/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveTagByIdFromNote
// ====================================================

export interface RemoveTagByIdFromNote_removeTagByIdFromNote_tags {
  __typename: 'Tag';
  _id: string;
  name: string;
  color: string;
}

export interface RemoveTagByIdFromNote_removeTagByIdFromNote {
  __typename: 'Link' | 'Text';
  _id: string;
  tags: (RemoveTagByIdFromNote_removeTagByIdFromNote_tags | null)[];
}

export interface RemoveTagByIdFromNote {
  removeTagByIdFromNote: RemoveTagByIdFromNote_removeTagByIdFromNote | null;
}

export interface RemoveTagByIdFromNoteVariables {
  noteId: string;
  tagId: string;
}
