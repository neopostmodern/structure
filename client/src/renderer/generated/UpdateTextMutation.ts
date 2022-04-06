/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InputText } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateTextMutation
// ====================================================

export interface UpdateTextMutation_updateText_tags {
  __typename: "Tag";
  _id: string;
  name: string;
  color: string;
}

export interface UpdateTextMutation_updateText {
  __typename: "Text";
  _id: string;
  createdAt: any;
  archivedAt: any | null;
  name: string;
  description: string;
  tags: UpdateTextMutation_updateText_tags[];
}

export interface UpdateTextMutation {
  updateText: UpdateTextMutation_updateText;
}

export interface UpdateTextMutationVariables {
  text: InputText;
}
