/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ToggleDeletedNoteMutation
// ====================================================

export interface ToggleDeletedNoteMutation_toggleDeletedNote {
  __typename: "Link" | "Text";
  _id: string;
  deletedAt: any | null;
}

export interface ToggleDeletedNoteMutation {
  toggleDeletedNote: ToggleDeletedNoteMutation_toggleDeletedNote;
}

export interface ToggleDeletedNoteMutationVariables {
  noteId: string;
}
