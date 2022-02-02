/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InputLink } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateLinkMutation
// ====================================================

export interface UpdateLinkMutation_updateLink_tags {
  __typename: "Tag";
  _id: string;
  name: string;
  color: string;
}

export interface UpdateLinkMutation_updateLink {
  __typename: "Link";
  _id: string;
  createdAt: any;
  url: string;
  domain: string;
  name: string;
  description: string;
  tags: (UpdateLinkMutation_updateLink_tags | null)[];
}

export interface UpdateLinkMutation {
  updateLink: UpdateLinkMutation_updateLink | null;
}

export interface UpdateLinkMutationVariables {
  link: InputLink;
}
