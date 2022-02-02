/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RevokeCredentialMutation
// ====================================================

export interface RevokeCredentialMutation_revokeCredential_credentials {
  __typename: "Credentials";
  bookmarklet: string | null;
  rss: string | null;
}

export interface RevokeCredentialMutation_revokeCredential {
  __typename: "User";
  _id: string;
  credentials: RevokeCredentialMutation_revokeCredential_credentials | null;
}

export interface RevokeCredentialMutation {
  revokeCredential: RevokeCredentialMutation_revokeCredential | null;
}

export interface RevokeCredentialMutationVariables {
  purpose: string;
}
