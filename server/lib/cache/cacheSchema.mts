import { gql } from 'graphql-tag'

export const cacheSchema = gql`
  type EntitiesUpdatedSince {
    addedNotes: [Note!]!
    updatedNotes: [Note!]!
    removedNoteIds: [ID!]!
    addedTags: [Tag!]!
    updatedTags: [Tag!]!
    removedTagIds: [ID!]!
    cacheId: ID!
  }

  extend type Query {
    entitiesUpdatedSince(cacheId: ID): EntitiesUpdatedSince!
  }
`
