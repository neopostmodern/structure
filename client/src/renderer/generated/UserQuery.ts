/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserQuery
// ====================================================

export interface UserQuery_currentUser {
  __typename: "User";
  _id: string;
  authenticationProvider: string | null;
  createdAt: any;
  name: string;
}

export interface UserQuery {
  currentUser: UserQuery_currentUser | null;
}
