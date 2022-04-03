/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ToggleArchivedNote
// ====================================================

export interface ToggleArchivedNote_toggleArchivedNote {
  __typename: "Link" | "Text";
  _id: string;
  archivedAt: any | null;
}

export interface ToggleArchivedNote {
  toggleArchivedNote: ToggleArchivedNote_toggleArchivedNote;
}

export interface ToggleArchivedNoteVariables {
  noteId: string;
}
