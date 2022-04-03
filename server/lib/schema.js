import { gql } from 'apollo-server'

export default gql`
  scalar Date

  type Versions {
    minimum: Int!
    recommended: Int
    maximum: Int
  }

  type Credentials {
    bookmarklet: String
    rss: String
  }
  type User {
    _id: String!
    name: String!
    createdAt: Date!
    authenticationProvider: String
    credentials: Credentials
  }

  type Tag {
    _id: ID!
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

  interface INote {
    type: NoteType!
    _id: ID!
    user: User!

    name: String!
    description: String!

    createdAt: Date!
    archivedAt: Date

    # Comments posted about this repository
    # tags(limit: Int, offset: Int): [Tag]!
    tags: [Tag]!
  }

  type Text implements INote {
    type: NoteType!
    _id: ID!
    user: User!

    name: String!
    description: String!

    createdAt: Date!
    archivedAt: Date

    # Comments posted about this repository
    # tags(limit: Int, offset: Int): [Tag]!
    tags: [Tag]!
  }
  input InputText {
    _id: ID!
    name: String
    description: String
  }

  # Information about a link
  type Link implements INote {
    type: NoteType!
    _id: ID!
    user: User!

    url: String!
    domain: String!
    path: String!
    name: String!
    description: String!

    createdAt: Date!
    archivedAt: Date

    # Comments posted about this repository
    # tags(limit: Int, offset: Int): [Tag]!
    tags: [Tag]!
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

    versions: Versions!

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
  }

  type Mutation {
    updateTag(tag: InputTag!): Tag!

    submitLink(url: String!): Link!
    updateLink(link: InputLink!): Link!
    deleteLink(linkId: ID!): Link!

    createText: Text!
    updateText(text: InputText!): Text!
    deleteText(textId: ID!): Text!

    addTagByNameToNote(noteId: ID!, name: String!): Note!

    removeTagByIdFromNote(noteId: ID!, tagId: ID!): Note!

    toggleArchivedNote(noteId: ID!): Note!

    requestNewCredential(purpose: String!): User!

    revokeCredential(purpose: String!): User!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`
