/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TextQuery
// ====================================================

export interface TextQuery_text_tags {
  __typename: 'Tag';
  _id: string;
  name: string;
  color: string;
}

export interface TextQuery_text {
  __typename: 'Text';
  _id: string;
  createdAt: any;
  name: string;
  description: string;
  tags: (TextQuery_text_tags | null)[];
}

export interface TextQuery {
  text: TextQuery_text | null;
}

export interface TextQueryVariables {
  textId?: string | null;
}
