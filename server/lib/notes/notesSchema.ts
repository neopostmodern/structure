import gql from 'graphql-tag'

export default gql`
  enum NoteType {
    TEXT
    LINK
  }

  interface INote { # implements BaseObject – blocked on https://github.com/apollographql/apollo-tooling/issues/2551, no GraphQL 16+ support coming
    type: NoteType!
    _id: ID!
    user: User!

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

  type Text implements BaseObject & INote {
    type: NoteType!
    _id: ID!
    user: User!

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
  input InputText {
    _id: ID!
    updatedAt: Date # todo: make mandatory in v0.21
    name: String
    description: String
  }

  # Information about a link
  type Link implements BaseObject & INote {
    type: NoteType!
    _id: ID!
    user: User!

    url: String!
    domain: String!
    path: String!
    name: String!
    description: String!

    createdAt: Date!
    updatedAt: Date!
    changedAt: Date!
    archivedAt: Date
    deletedAt: Date

    # Comments posted about this repository
    # tags(limit: Int, offset: Int): [Tag]!
    tags: [Tag!]!
  }
  input InputLink {
    _id: ID!
    updatedAt: Date # todo: make mandatory in v0.21
    url: String
    domain: String
    path: String
    name: String
    description: String
    archivedAt: Date
  }

  union Note = Link | Text

  extend type Query {
    links(
      # The number of items to skip, for pagination
      offset: Int

      # The number of items to fetch starting from the offset, for pagination
      limit: Int
    ): [Link!]!

    notes(offset: Int, limit: Int): [Note!]!

    link(linkId: ID): Link!
    text(textId: ID): Text!

    titleSuggestions(linkId: ID!): [String!]!
  }

  extend type Mutation {
    submitLink(url: String!, title: String, description: String): Link!
    updateLink(link: InputLink!): Link!

    createText(title: String, description: String): Text!
    updateText(text: InputText!): Text!

    toggleArchivedNote(noteId: ID!): Note!
    toggleDeletedNote(noteId: ID!): Note!
  }
`
