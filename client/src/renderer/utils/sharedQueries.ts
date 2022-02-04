import gql from 'graphql-tag';

export const PROFILE_QUERY = gql`
  query CurrentUserForLayout {
    currentUser {
      _id
      name
    }
  }
`;
export const VERSIONS_QUERY = gql`
  query Versions {
    versions {
      minimum
      recommended
    }
  }
`;
