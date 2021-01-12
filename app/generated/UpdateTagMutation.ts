/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InputTag, NoteType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateTagMutation
// ====================================================

export interface UpdateTagMutation_updateTag_notes_Text_tags {
  __typename: "Tag";
  _id: string;
  name: string;
  color: string;
}

export interface UpdateTagMutation_updateTag_notes_Text {
  __typename: "Text";
  type: NoteType;
  _id: string;
  name: string;
  createdAt: any;
  archivedAt: any | null;
  description: string;
  tags: (UpdateTagMutation_updateTag_notes_Text_tags | null)[];
}

export interface UpdateTagMutation_updateTag_notes_Link_tags {
  __typename: "Tag";
  _id: string;
  name: string;
  color: string;
}

export interface UpdateTagMutation_updateTag_notes_Link {
  __typename: "Link";
  type: NoteType;
  _id: string;
  name: string;
  createdAt: any;
  archivedAt: any | null;
  description: string;
  tags: (UpdateTagMutation_updateTag_notes_Link_tags | null)[];
  url: string;
  domain: string;
}

export type UpdateTagMutation_updateTag_notes = UpdateTagMutation_updateTag_notes_Text | UpdateTagMutation_updateTag_notes_Link;

export interface UpdateTagMutation_updateTag {
  __typename: "Tag";
  _id: string;
  name: string;
  color: string;
  notes: (UpdateTagMutation_updateTag_notes | null)[] | null;
}

export interface UpdateTagMutation {
  updateTag: UpdateTagMutation_updateTag | null;
}

export interface UpdateTagMutationVariables {
  tag: InputTag;
}
