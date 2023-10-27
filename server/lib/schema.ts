import { makeExecutableSchema } from '@graphql-tools/schema'
import { gql } from 'graphql-tag'
import merge from 'lodash/merge'

import { cacheResolvers } from './cache/cacheResolvers'
import { cacheSchema } from './cache/cacheSchema'
import { notesResolvers } from './notes/notesResolvers'
import notesSchema from './notes/notesSchema'
import { tagsResolvers } from './tags/tagsResolvers'
import { tagsSchema } from './tags/tagsSchema'
import { userResolvers } from './users/userResolvers'
import { userSchema } from './users/userSchema'
import { baseObjectSchema } from './util/baseObject'
import { dateTypeResolver, dateTypeSchema } from './util/dateType'
import { versionInfoResolver, versionInfoSchema } from './util/versionInfo'

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
