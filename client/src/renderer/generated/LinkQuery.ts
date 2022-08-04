/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: LinkQuery
// ====================================================

export interface LinkQuery_link_tags {
  __typename: 'Tag';
  _id: string;
  name: string;
  color: string;
}

export interface LinkQuery_link {
  __typename: 'Link';
  _id: string;
  createdAt: any;
  updatedAt: any;
  archivedAt: any | null;
  url: string;
  name: string;
  description: string;
  domain: string;
  tags: LinkQuery_link_tags[];
}

export interface LinkQuery {
  link: LinkQuery_link;
}

export interface LinkQueryVariables {
  linkId?: string | null;
}
