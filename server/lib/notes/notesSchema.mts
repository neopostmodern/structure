import { gql } from 'graphql-tag'

export default gql`
  type Note implements BaseObject {
    _id: ID!
    user: User!

    url: String
    domain: String
    path: String
    name: String!
    description: String!

    createdAt: Date!
    updatedAt: Date!
    changedAt: Date!
    archivedAt: Date
    deletedAt: Date

    # tags(limit: Int, offset: Int): [Tag]!
    tags: [Tag!]!
  }
  input InputNote {
    _id: ID!
    updatedAt: Date!
    url: String
    domain: String
    path: String
    name: String
    description: String
    archivedAt: Date
  }

  extend type Query {
    notes(offset: Int, limit: Int): [Note!]!

    note(noteId: ID!): Note!
    titleSuggestions(noteId: ID!): [String!]!
  }

  extend type Mutation {
    createNote(url: String, title: String, description: String): Note!
    updateNote(note: InputNote!): Note!

    toggleArchivedNote(noteId: ID!): Note!
    toggleDeletedNote(noteId: ID!): Note!
  }
`
