import gql from 'graphql-tag'

export const userSchema = gql`
  type Credentials {
    bookmarklet: String
    rss: String
  }
  type User implements BaseObject {
    _id: ID!
    createdAt: Date!
    updatedAt: Date!

    name: String!
    authenticationProvider: String
    credentials: Credentials
  }

  extend type Query {
    # Return the currently logged in user, or null if nobody is logged in
    currentUser: User
  }

  extend type Mutation {
    requestNewCredential(purpose: String!): User!

    revokeCredential(purpose: String!): User!
  }
`
