import { gql } from 'graphql-tag'

export const userSchema = gql`
  type Token {
    _id: ID!
    purpose: String!
    comment: String
    createdAt: Date!
  }
  type CreateTokenResult {
    rawToken: String!
    user: User!
  }
  type User implements BaseObject {
    _id: ID!
    createdAt: Date!
    updatedAt: Date!

    name: String!
    authenticationProvider: String
    tokens: [Token!]!
  }

  extend type Query {
    # Return the currently logged in user, or null if nobody is logged in
    currentUser: User
  }

  extend type Mutation {
    createToken(comment: String): CreateTokenResult!
    revokeToken(tokenId: ID!): User!
  }
`
