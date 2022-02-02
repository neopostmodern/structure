/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserCredentialsQuery
// ====================================================

export interface UserCredentialsQuery_currentUser_credentials {
  __typename: "Credentials";
  bookmarklet: string | null;
  rss: string | null;
}

export interface UserCredentialsQuery_currentUser {
  __typename: "User";
  _id: string;
  credentials: UserCredentialsQuery_currentUser_credentials | null;
}

export interface UserCredentialsQuery {
  currentUser: UserCredentialsQuery_currentUser | null;
}
