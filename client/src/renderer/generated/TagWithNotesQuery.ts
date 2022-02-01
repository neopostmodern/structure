/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NoteType } from './globalTypes';

// ====================================================
// GraphQL query operation: TagWithNotesQuery
// ====================================================

export interface TagWithNotesQuery_tag_notes_Text_tags {
  __typename: 'Tag';
  _id: string;
  name: string;
  color: string;
}

export interface TagWithNotesQuery_tag_notes_Text {
  __typename: 'Text';
  type: NoteType;
  _id: string;
  name: string;
  createdAt: any;
  archivedAt: any | null;
  description: string;
  tags: (TagWithNotesQuery_tag_notes_Text_tags | null)[];
}

export interface TagWithNotesQuery_tag_notes_Link_tags {
  __typename: 'Tag';
  _id: string;
  name: string;
  color: string;
}

export interface TagWithNotesQuery_tag_notes_Link {
  __typename: 'Link';
  type: NoteType;
  _id: string;
  name: string;
  createdAt: any;
  archivedAt: any | null;
  description: string;
  tags: (TagWithNotesQuery_tag_notes_Link_tags | null)[];
  url: string;
  domain: string;
}

export type TagWithNotesQuery_tag_notes =
  | TagWithNotesQuery_tag_notes_Text
  | TagWithNotesQuery_tag_notes_Link;

export interface TagWithNotesQuery_tag {
  __typename: 'Tag';
  _id: string;
  name: string;
  color: string;
  notes: (TagWithNotesQuery_tag_notes | null)[] | null;
}

export interface TagWithNotesQuery {
  tag: TagWithNotesQuery_tag | null;
}

export interface TagWithNotesQueryVariables {
  tagId: string;
}
