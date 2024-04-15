import gql from 'graphql-tag'

export const tagsSchema = gql`
  type Tag implements BaseObject {
    _id: ID!
    createdAt: Date!
    updatedAt: Date!
    user: User!

    name: String!
    color: String!

    notes: [Note]
    noteCount: Int!

    permissions(onlyMine: Boolean): [UserPermissions!]!
  }
  input InputTag {
    _id: ID!
    updatedAt: Date # todo: make mandatory in v0.21
    name: String!
    color: String!
  }

  extend type Query {
    tags(offset: Int, limit: Int): [Tag!]!

    tag(tagId: ID): Tag!
  }

  extend type Mutation {
    createTag(name: String!, color: String): Tag!
    updateTag(tag: InputTag!): Tag!
    permanentlyDeleteTag(tagId: ID!): Tag!
    shareTag(tagId: ID!, username: String!): Tag!
    updatePermissionOnTag(
      tagId: ID!
      userId: ID!
      resource: String!
      mode: String!
      granted: Boolean!
    ): Tag!
    unshareTag(tagId: ID!, userId: ID!): Tag!

    addTagByNameToNote(noteId: ID!, name: String!): Note!

    removeTagByIdFromNote(noteId: ID!, tagId: ID!): Note!
  }
`
