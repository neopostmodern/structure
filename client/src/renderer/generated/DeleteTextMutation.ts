/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteTextMutation
// ====================================================

export interface DeleteTextMutation_deleteText {
  __typename: 'Text';
  _id: string;
}

export interface DeleteTextMutation {
  deleteText: DeleteTextMutation_deleteText | null;
}

export interface DeleteTextMutationVariables {
  textId: string;
}
