import gql from 'graphql-tag';

export const PROFILE_QUERY = gql`
  query ProfileQuery($currentVersion: String!) {
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
