/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddLinkMutation
// ====================================================

export interface AddLinkMutation_submitLink_tags {
  __typename: 'Tag';
  _id: string;
  name: string;
  color: string;
}

export interface AddLinkMutation_submitLink {
  __typename: 'Link';
  _id: string;
  name: string;
  createdAt: any;
  archivedAt: any | null;
  description: string;
  tags: (AddLinkMutation_submitLink_tags | null)[];
  url: string;
  domain: string;
}

export interface AddLinkMutation {
  submitLink: AddLinkMutation_submitLink | null;
}

export interface AddLinkMutationVariables {
  url: string;
}
