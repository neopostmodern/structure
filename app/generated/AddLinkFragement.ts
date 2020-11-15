/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AddLinkFragement
// ====================================================

export interface AddLinkFragement_tags {
  __typename: "Tag";
  _id: string;
  name: string;
  color: string;
}

export interface AddLinkFragement {
  __typename: "Link";
  _id: string;
  createdAt: any;
  url: string;
  tags: (AddLinkFragement_tags | null)[];
}
