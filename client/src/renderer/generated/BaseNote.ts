/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: BaseNote
// ====================================================

export interface BaseNote_Text_tags {
  __typename: "Tag";
  _id: string;
  name: string;
  color: string;
}

export interface BaseNote_Text {
  __typename: "Text";
  _id: string;
  name: string;
  createdAt: any;
  archivedAt: any | null;
  description: string;
  tags: (BaseNote_Text_tags | null)[];
}

export interface BaseNote_Link_tags {
  __typename: "Tag";
  _id: string;
  name: string;
  color: string;
}

export interface BaseNote_Link {
  __typename: "Link";
  _id: string;
  name: string;
  createdAt: any;
  archivedAt: any | null;
  description: string;
  tags: (BaseNote_Link_tags | null)[];
  url: string;
  domain: string;
}

export type BaseNote = BaseNote_Text | BaseNote_Link;
