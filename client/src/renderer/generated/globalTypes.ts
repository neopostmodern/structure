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
  archivedAt?: any | null;
  description?: string | null;
  domain?: string | null;
  name?: string | null;
  path?: string | null;
  url?: string | null;
}

export interface InputTag {
  _id: string;
  color: string;
  name: string;
}

export interface InputText {
  _id: string;
  description?: string | null;
  name?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
