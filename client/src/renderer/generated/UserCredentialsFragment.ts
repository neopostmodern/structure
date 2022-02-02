/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserCredentialsFragment
// ====================================================

export interface UserCredentialsFragment_credentials {
  __typename: "Credentials";
  bookmarklet: string | null;
  rss: string | null;
}

export interface UserCredentialsFragment {
  __typename: "User";
  _id: string;
  credentials: UserCredentialsFragment_credentials | null;
}
