/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NoteType } from './globalTypes';

// ====================================================
// GraphQL fragment: NoteFragment
// ====================================================

export interface NoteFragment_Text_tags {
  __typename: 'Tag';
  _id: string;
  name: string;
  color: string;
}

export interface NoteFragment_Text {
  __typename: 'Text';
  type: NoteType;
  _id: string;
  name: string;
  createdAt: any;
  archivedAt: any | null;
  description: string;
  tags: (NoteFragment_Text_tags | null)[];
}

export interface NoteFragment_Link_tags {
  __typename: 'Tag';
  _id: string;
  name: string;
  color: string;
}

export interface NoteFragment_Link {
  __typename: 'Link';
  type: NoteType;
  _id: string;
  name: string;
  createdAt: any;
  archivedAt: any | null;
  description: string;
  tags: (NoteFragment_Link_tags | null)[];
  url: string;
  domain: string;
}

export type NoteFragment = NoteFragment_Text | NoteFragment_Link;
