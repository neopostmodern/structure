import gql from 'graphql-tag';

export const PROFILE_QUERY = gql`
  query Profile($currentVersion: String!) {
    currentUser {
      _id
      name
    }
    versions(currentVersion: $currentVersion) {
      current
      minimum
    }
  }
`;

export const BASE_NOTE_FRAGMENT = gql`
  fragment BaseNote on INote {
    ... on INote {
      # type
      _id
      name
      createdAt
      updatedAt
      archivedAt
      deletedAt

      description
      tags {
        _id
        name
        color
      }
    }
    ... on Link {
      url
      domain
    }
  }
`;

export const BASE_TAG_FRAGMENT = gql`
  fragment BaseTag on Tag {
    _id
    createdAt
    updatedAt

    name
    color
  }
`;
