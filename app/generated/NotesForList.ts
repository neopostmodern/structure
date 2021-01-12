/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NoteType } from "./globalTypes";

// ====================================================
// GraphQL query operation: NotesForList
// ====================================================

export interface NotesForList_notes_Text_tags {
  __typename: "Tag";
  _id: string;
  name: string;
  color: string;
}

export interface NotesForList_notes_Text {
  __typename: "Text";
  type: NoteType;
  _id: string;
  name: string;
  createdAt: any;
  archivedAt: any | null;
  description: string;
  tags: (NotesForList_notes_Text_tags | null)[];
}

export interface NotesForList_notes_Link_tags {
  __typename: "Tag";
  _id: string;
  name: string;
  color: string;
}

export interface NotesForList_notes_Link {
  __typename: "Link";
  type: NoteType;
  _id: string;
  name: string;
  createdAt: any;
  archivedAt: any | null;
  description: string;
  tags: (NotesForList_notes_Link_tags | null)[];
  url: string;
  domain: string;
}

export type NotesForList_notes = NotesForList_notes_Text | NotesForList_notes_Link;

export interface NotesForList {
  notes: (NotesForList_notes | null)[] | null;
}
