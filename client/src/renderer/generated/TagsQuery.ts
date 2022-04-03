/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TagsQuery
// ====================================================

export interface TagsQuery_tags {
  __typename: "Tag";
  _id: string;
  name: string;
  color: string;
}

export interface TagsQuery {
  tags: TagsQuery_tags[];
}
