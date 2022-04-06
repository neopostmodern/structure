/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddTextMutation
// ====================================================

export interface AddTextMutation_createText_tags {
  __typename: "Tag";
  _id: string;
  name: string;
  color: string;
}

export interface AddTextMutation_createText {
  __typename: "Text";
  _id: string;
  name: string;
  createdAt: any;
  archivedAt: any | null;
  description: string;
  tags: AddTextMutation_createText_tags[];
}

export interface AddTextMutation {
  createText: AddTextMutation_createText;
}
