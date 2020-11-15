/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddLinkMutation
// ====================================================

export interface AddLinkMutation_submitLink_tags {
  __typename: "Tag";
  _id: string;
  name: string;
  color: string;
}

export interface AddLinkMutation_submitLink {
  __typename: "Link";
  _id: string;
  createdAt: any;
  url: string;
  tags: (AddLinkMutation_submitLink_tags | null)[];
}

export interface AddLinkMutation {
  submitLink: AddLinkMutation_submitLink | null;
}

export interface AddLinkMutationVariables {
  url: string;
}
