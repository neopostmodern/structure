/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteLinkMutation
// ====================================================

export interface DeleteLinkMutation_deleteLink {
  __typename: 'Link';
  _id: string;
}

export interface DeleteLinkMutation {
  deleteLink: DeleteLinkMutation_deleteLink | null;
}

export interface DeleteLinkMutationVariables {
  linkId: string;
}
