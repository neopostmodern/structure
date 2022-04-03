/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddTagByNameToNote
// ====================================================

export interface AddTagByNameToNote_addTagByNameToNote_tags {
  __typename: "Tag";
  _id: string;
  name: string;
  color: string;
}

export interface AddTagByNameToNote_addTagByNameToNote {
  __typename: "Link" | "Text";
  _id: string;
  tags: (AddTagByNameToNote_addTagByNameToNote_tags | null)[];
}

export interface AddTagByNameToNote {
  addTagByNameToNote: AddTagByNameToNote_addTagByNameToNote;
}

export interface AddTagByNameToNoteVariables {
  noteId: string;
  tagName: string;
}
