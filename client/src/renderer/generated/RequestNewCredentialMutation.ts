/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RequestNewCredentialMutation
// ====================================================

export interface RequestNewCredentialMutation_requestNewCredential_credentials {
  __typename: "Credentials";
  bookmarklet: string | null;
  rss: string | null;
}

export interface RequestNewCredentialMutation_requestNewCredential {
  __typename: "User";
  _id: string;
  credentials: RequestNewCredentialMutation_requestNewCredential_credentials | null;
}

export interface RequestNewCredentialMutation {
  requestNewCredential: RequestNewCredentialMutation_requestNewCredential | null;
}

export interface RequestNewCredentialMutationVariables {
  purpose: string;
}
