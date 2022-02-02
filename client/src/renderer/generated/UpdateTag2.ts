/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InputTag } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateTag2
// ====================================================

export interface UpdateTag2_updateTag {
  __typename: "Tag";
  _id: string;
  name: string;
  color: string;
}

export interface UpdateTag2 {
  updateTag: UpdateTag2_updateTag | null;
}

export interface UpdateTag2Variables {
  tag: InputTag;
}
