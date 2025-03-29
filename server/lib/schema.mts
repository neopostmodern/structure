import { makeExecutableSchema } from '@graphql-tools/schema'
import { gql } from 'graphql-tag'
import merge from 'lodash/merge.js'

import { cacheResolvers } from './cache/cacheResolvers.mts'
import { cacheSchema } from './cache/cacheSchema.mts'
import { notesResolvers } from './notes/notesResolvers.mts'
import notesSchema from './notes/notesSchema.mts'
import { tagsResolvers } from './tags/tagsResolvers.mts'
import { tagsSchema } from './tags/tagsSchema.mts'
import { userResolvers } from './users/userResolvers.mts'
import { userSchema } from './users/userSchema.mts'
import { baseObjectSchema } from './util/baseObject.mts'
import { dateTypeResolver, dateTypeSchema } from './util/dateType.mts'
import { versionInfoResolver, versionInfoSchema } from './util/versionInfo.mts'

let baseSchemaDefinition = gql`
  type TagPermissions {
    read: Boolean!
    write: Boolean!
    use: Boolean!
    share: Boolean!
  }
  type NotesPermissions {
    read: Boolean!
    write: Boolean!
  }
  type UserPermissions {
    user: User!
    tag: TagPermissions!
    notes: NotesPermissions!
  }

  type Query
  type Mutation
`

export const typeDefs = [
  baseSchemaDefinition,
  dateTypeSchema,
  baseObjectSchema,
  versionInfoSchema,
  cacheSchema,
  notesSchema,
  tagsSchema,
  userSchema,
]
export const resolvers = merge(
  {},
  dateTypeResolver,
  versionInfoResolver,
  cacheResolvers,
  notesResolvers,
  tagsResolvers,
  userResolvers,
)

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export default executableSchema
