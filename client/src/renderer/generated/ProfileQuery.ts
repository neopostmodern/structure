/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProfileQuery
// ====================================================

export interface ProfileQuery_currentUser {
  __typename: "User";
  _id: string;
  name: string;
}

export interface ProfileQuery_versions {
  __typename: "Versions";
  current: string;
  minimum: string | null;
}

export interface ProfileQuery {
  currentUser: ProfileQuery_currentUser | null;
  versions: ProfileQuery_versions;
}

export interface ProfileQueryVariables {
  currentVersion: string;
}
