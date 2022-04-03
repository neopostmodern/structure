/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: VisitedNotes
// ====================================================

export interface VisitedNotes_notes {
  __typename: "Link" | "Text";
  _id: string;
  name: string;
}

export interface VisitedNotes {
  notes: VisitedNotes_notes[];
}
