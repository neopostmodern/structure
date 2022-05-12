import { gql } from 'apollo-server'

export default gql`
  scalar Date

  interface BaseObject {
    _id: ID!
    createdAt: Date!
    updatedAt: Date!
  }

  type Versions {
    minimum: String
    current: String!
    recommended: String
      @deprecated(reason: "Upgrade to 0.20.0+ and use 'current' field")
  }

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

  type Tag implements BaseObject {
    _id: ID!
    createdAt: Date!
    updatedAt: Date!
    user: User!

    name: String!
    color: String!

    notes: [Note]
  }
  input InputTag {
    _id: ID!

    name: String!
    color: String!
  }

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
    archivedAt: Date
    deletedAt: Date

    # tags(limit: Int, offset: Int): [Tag]!
    tags: [Tag!]!
  }
  input InputText {
    _id: ID!
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
    archivedAt: Date
    deletedAt: Date

    # Comments posted about this repository
    # tags(limit: Int, offset: Int): [Tag]!
    tags: [Tag!]!
  }
  input InputLink {
    _id: ID!
    url: String
    domain: String
    path: String
    name: String
    description: String
    archivedAt: Date
  }

  union Note = Link | Text

  type Query {
    # Return the currently logged in user, or null if nobody is logged in
    currentUser: User

    versions(currentVersion: String): Versions!

    links(
      # The number of items to skip, for pagination
      offset: Int

      # The number of items to fetch starting from the offset, for pagination
      limit: Int
    ): [Link!]!

    notes(offset: Int, limit: Int): [Note!]!

    link(linkId: ID): Link!
    text(textId: ID): Text!

    tags(offset: Int, limit: Int): [Tag!]!

    tag(tagId: ID): Tag!

    titleSuggestions(linkId: ID!): [String!]!
  }

  type Mutation {
    updateTag(tag: InputTag!): Tag!

    submitLink(url: String!): Link!
    updateLink(link: InputLink!): Link!

    createText(title: String): Text!
    updateText(text: InputText!): Text!

    addTagByNameToNote(noteId: ID!, name: String!): Note!

    removeTagByIdFromNote(noteId: ID!, tagId: ID!): Note!

    toggleArchivedNote(noteId: ID!): Note!
    toggleDeletedNote(noteId: ID!): Note!

    requestNewCredential(purpose: String!): User!

    revokeCredential(purpose: String!): User!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`
