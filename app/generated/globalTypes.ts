/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum NoteType {
  LINK = "LINK",
  TEXT = "TEXT",
}

export interface InputLink {
  _id: string;
  url?: string | null;
  domain?: string | null;
  path?: string | null;
  name?: string | null;
  description?: string | null;
  archivedAt?: any | null;
}

export interface InputTag {
  _id: string;
  name: string;
  color: string;
}

export interface InputText {
  _id: string;
  name?: string | null;
  description?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
