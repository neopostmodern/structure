/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InputTag, NoteType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateTag2
// ====================================================

export interface UpdateTag2_updateTag_notes_Text_tags {
  __typename: "Tag";
  _id: string;
  name: string;
  color: string;
}

export interface UpdateTag2_updateTag_notes_Text {
  __typename: "Text";
  type: NoteType;
  _id: string;
  createdAt: any;
  description: string;
  tags: (UpdateTag2_updateTag_notes_Text_tags | null)[];
}

export interface UpdateTag2_updateTag_notes_Link_tags {
  __typename: "Tag";
  _id: string;
  name: string;
  color: string;
}

export interface UpdateTag2_updateTag_notes_Link {
  __typename: "Link";
  type: NoteType;
  _id: string;
  createdAt: any;
  description: string;
  tags: (UpdateTag2_updateTag_notes_Link_tags | null)[];
  url: string;
  domain: string;
  name: string;
}

export type UpdateTag2_updateTag_notes = UpdateTag2_updateTag_notes_Text | UpdateTag2_updateTag_notes_Link;

export interface UpdateTag2_updateTag {
  __typename: "Tag";
  _id: string;
  name: string;
  color: string;
  notes: (UpdateTag2_updateTag_notes | null)[] | null;
}

export interface UpdateTag2 {
  updateTag: UpdateTag2_updateTag | null;
}

export interface UpdateTag2Variables {
  tag: InputTag;
}
