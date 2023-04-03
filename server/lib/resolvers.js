import { makeExecutableSchema } from '@graphql-tools/schema'
import { GraphQLErrorCodes, INTERNAL_TAG_PREFIX } from '@structure/common'
import { GraphQLError, GraphQLScalarType, Kind } from 'graphql'
import Moment from 'moment'
import packageJson from '../package.json' assert { type: 'json' }
import {
  addTagByNameToNote,
  entitiesUpdatedSince,
  fetchTitleSuggestions,
  removeTagByIdFromNote,
  requestNewCredential,
  revokeCredential,
  submitLink,
} from './methods.js'
import { Link, Note, Tag, Text } from './mongo.js'
import schemaDefinition from './schema.js'
import {
  baseNotesQuery,
  baseTagsQuery,
  createTagObject,
  getCachedUser,
  leanTypeEnumFixer,
} from './util.js'

const INoteResolvers = {
  async tags(note, args, context) {
    return Tag.find({
      ...baseTagsQuery(context.user, 'read'),
      _id: { $in: note.tags },
    }).lean()
  },
  async user(note, args, context) {
    return getCachedUser(note.user, context.user)
  },
}

const rootResolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value) // value from the client
    },
    serialize(value) {
      return value.getTime() // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10) // ast value is always in string format
      }
      return null
    },
  }),
  Note: {
    __resolveType(obj, context, info) {
      // console.log("__resolveType", obj.type, obj.type[0].toUpperCase() + obj.type.substring(1).toLowerCase());
      return obj.type[0].toUpperCase() + obj.type.substring(1).toLowerCase()
    },
  },
  Link: INoteResolvers,
  Text: INoteResolvers,
  Tag: {
    async notes(tag, args, context) {
      if (tag.notes && context.__skip_notes_population) {
        return tag.notes
      }
      // todo: check permissions!
      //  (test: B shares N with A. A adds tag Y to N. B unshares (by untagging X) N, then A should not see N despite it having the tag Y.
      const notes = await Note.find({ tags: tag, deletedAt: null }).lean()
      return leanTypeEnumFixer(notes)
    },
    async user(note, args, context) {
      return getCachedUser(note.user, context.user)
    },
    permissions(tag, { onlyMine }, { user }, info) {
      // todo: investigate
      // let path = []
      // let x = info.path
      // while (true) {
      //   path.push(`${x.key} (${x.typename})`)
      //   if (x.prev) {
      //     x = x.prev
      //   } else {
      //     break
      //   }
      // }
      // const pathString = path.reverse().join(' › ')
      // console.log(pathString)
      //
      // console.log('tag.permissions is a map?', tag.permissions instanceof Map)
      let permissionsArray =
        tag.permissions instanceof Map // todo: why is this not always a map?
          ? [...tag.permissions.entries()]
          : Object.entries(tag.permissions)

      if (onlyMine) {
        permissionsArray = permissionsArray.filter(
          ([userId]) => userId === user._id,
        )
      }

      return permissionsArray.map(([userId, permissions]) => ({
        user: { _id: userId },
        ...(permissions.toObject ? permissions.toObject() : permissions), // todo: for some reason this is not a plain object when coming from TagPage
      }))
    },
  },
  UserPermissions: {
    async user(userPermission, args, context) {
      return getCachedUser(userPermission.user, context.user)
    },
  },
  Query: {
    currentUser(root, args, context) {
      return context.user || null
    },
    versions(root, { currentVersion }) {
      if (currentVersion) {
        return {
          // todo: set minimum version!
          // minimum: '0.20.0',
          current: packageJson.version,
        }
      }

      // backward compatibility < 0.20.0
      return {
        minimum: 8,
        recommended: 8,
      }
    },
    async notes(root, { offset, limit }, { user }) {
      if (!user) {
        throw new Error('Need to be logged in to fetch links.')
      }
      const protectedLimit = limit < 1 || limit > 10 ? 10 : limit

      return Note.find({
        ...(await baseNotesQuery(user, 'read')),
        deletedAt: null,
      })
        .sort({ createdAt: -1 })
        .limit(protectedLimit)
        .lean()
        .exec()
        .then(leanTypeEnumFixer)
    },
    async entitiesUpdatedSince(root, { cacheId }, { user }) {
      return entitiesUpdatedSince(cacheId, user)
    },
    async link(root, { linkId }, { user }) {
      if (!user) {
        throw new Error('Need to be logged in to fetch a link.')
      }
      const link = await Link.findOne({
        _id: linkId,
        ...(await baseNotesQuery(user, 'read')),
      })
      if (!link) {
        throw new GraphQLError(
          `No link with ID '${linkId}' found for this user.`,
          {
            extensions: {
              code: GraphQLErrorCodes.ENTITY_NOT_FOUND,
            },
          },
        )
      }
      return link
    },
    async links(root, { offset, limit }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to fetch links.')
      }
      const protectedLimit = limit < 1 || limit > 10 ? 10 : limit
      return Link.find({
        ...(await baseNotesQuery(context.user, 'read')),
        deletedAt: null,
      })
        .sort({ createdAt: -1 })
        .limit(protectedLimit)
        .exec()
    },
    async text(root, { textId }, { user }) {
      if (!user) {
        throw new Error('Need to be logged in to fetch a text.')
      }

      const text = await Text.findOne({
        ...(await baseNotesQuery(user, 'read')),
        _id: textId,
      })
      if (!text) {
        throw new GraphQLError(
          `No text with ID '${textId}' found for this user.`,
          {
            extensions: {
              code: GraphQLErrorCodes.ENTITY_NOT_FOUND,
            },
          },
        )
      }

      return text
    },
    async tag(root, { tagId }, { user }) {
      if (!user) {
        throw new Error('Need to be logged in to fetch a tag.')
      }

      const tag = await Tag.findOne({
        _id: tagId,
        ...baseTagsQuery(user, 'read'),
      })
      if (!tag) {
        throw new GraphQLError(
          `No tag with ID '${tagId}' found for this user.`,
          {
            extensions: {
              code: GraphQLErrorCodes.ENTITY_NOT_FOUND,
            },
          },
        )
      }
      return tag
    },
    async tags(root, { offset, limit }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to fetch links.')
      }
      const protectedLimit = limit < 1 || limit > 10 ? 10 : limit
      return (
        Tag.find({ ...baseTagsQuery(context.user, 'read') })
          // .sort({ createdAt: -1 })
          .limit(protectedLimit)
          // .populate("tags")
          .exec()
      )
    },
    async titleSuggestions(root, { linkId }, { user }) {
      if (!user) {
        throw new Error('Need to be logged in to fetch title suggestions.')
      }
      const link = await Link.findOne({
        _id: linkId,
        ...(await baseNotesQuery(user, 'write')),
      })
      if (!link) {
        throw new Error(`No link with ID ${linkId} or no sufficient privileges`)
      }
      try {
        return fetchTitleSuggestions(link.url)
      } catch (error) {
        console.warn(`Failed to fetch title suggestions for ${linkId}`, error)
        return []
      }
    },
  },
  Mutation: {
    createTag(root, { name, color }, context) {
      const { user } = context
      if (!user) {
        throw new Error('Need to be logged in to create tags.')
      }

      if (name.startsWith(INTERNAL_TAG_PREFIX)) {
        throw new Error(
          `User tags can't start with prefix "${INTERNAL_TAG_PREFIX}".`,
        )
      }

      return Tag.findOne({
        name,
        ...baseTagsQuery(user, 'use'),
      }).then((tag) => {
        if (tag) {
          throw new Error(`Tag with name '${name}' already exists.`)
        }

        return new Tag(createTagObject({ name, color, user })).save()
      })
    },
    updateTag(root, { tag: { _id, ...props } }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to update tags.')
      }
      return Tag.findOne({
        _id,
        ...baseTagsQuery(context.user, 'write'),
      }).then((tag) => {
        if (!tag) {
          throw new Error('Resource could not be found.')
        }

        if (tag.updatedAt > props.updatedAt) {
          throw new Error(
            'Tag has been changed externally since last sync, change rejected.',
          )
        }

        Object.entries(props).forEach(([propName, propValue]) => {
          tag[propName] = propValue
        })
        return tag.save()
      })
    },
    async permanentlyDeleteTag(root, { tagId: _id }, { user, ...context }) {
      if (!user) {
        throw new Error('Need to be logged in to update tags.')
      }
      const tag = await Tag.findOne({ _id, user }).exec()
      if (!tag) {
        throw new Error('Tag could not be found.')
      }

      const updatedNotes = []

      const notes = await Note.find({ tags: tag._id }).exec()
      for (const note of notes) {
        updatedNotes.push(await removeTagByIdFromNote(user, note._id, tag._id))
      }

      await tag.remove()

      context.__skip_notes_population = true
      tag.notes = updatedNotes

      return tag
    },
    async updatePermissionOnTag(
      root,
      { tagId, userId, resource, mode, granted },
      { user },
    ) {
      if (!user) {
        throw new Error('Need to be logged in to update permissions.')
      }

      const tag = await Tag.findOne({
        _id: tagId,
        ...baseTagsQuery(user, 'share'),
      })
      if (!tag) {
        throw new Error('No such tag or no sufficient privileges.')
      }

      const userPermissions = tag.permissions.get(userId)
      if (!userPermissions) {
        throw new Error(
          'Cannot update permissions for user with no previous permissions.',
        )
      }

      if (typeof userPermissions[resource]?.[mode] === 'undefined') {
        throw new Error(`No such permission: ${resource}.${mode}`)
      }

      userPermissions[resource][mode] = granted
      tag.permissions.set(userId, userPermissions)

      return tag.save()
    },
    submitLink(root, { url, title, description }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to submit links.')
      }
      return submitLink(context.user, { url, title, description })
    },
    async updateLink(root, { link: { _id, ...props } }, { user }) {
      if (!user) {
        throw new Error('Need to be logged in to update links.')
      }
      return Link.findOne({
        _id,
        ...(await baseNotesQuery(user, 'write')),
      }).then((link) => {
        if (!link) {
          throw new Error('Resource could not be found.')
        }

        if (link.updatedAt > props.updatedAt) {
          throw new Error(
            'Note has been changed externally since last sync, change rejected.',
          )
        }

        Object.entries(props).forEach(([propName, propValue]) => {
          link[propName] = propValue
        })
        return link.save()
      })
    },

    async createText(root, { title, description }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to create texts.')
      }

      return new Text({
        name: title || new Moment().format('dddd, MMMM Do YYYY'),
        description,
        user: context.user,
        tags: [context.user.internal.ownershipTagId],
      }).save()
    },
    async updateText(root, { text: { _id, ...props } }, { user }) {
      if (!user) {
        throw new Error('Need to be logged in to update texts.')
      }
      return Text.findOne({
        ...(await baseNotesQuery(user, 'write')),
        _id,
      }).then((text) => {
        if (!text) {
          throw new Error('Resource could not be found.')
        }

        if (text.updatedAt > props.updatedAt) {
          throw new Error(
            'Note has been changed externally since last sync, change rejected.',
          )
        }

        Object.entries(props).forEach(([propName, propValue]) => {
          text[propName] = propValue
        })
        return text.save()
      })
    },

    addTagByNameToNote(root, { noteId, name }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to tag notes.')
      }
      if (name.startsWith(INTERNAL_TAG_PREFIX)) {
        throw new Error(
          `User tags can't start with prefix "${INTERNAL_TAG_PREFIX}".`,
        )
      }
      return addTagByNameToNote(context.user, noteId, name)
    },
    removeTagByIdFromNote(root, { noteId, tagId }, { user }) {
      if (!user) {
        throw new Error('Need to be logged in to untag notes.')
      }
      return removeTagByIdFromNote(user, noteId, tagId)
    },
    toggleArchivedNote(root, { noteId }, context) {
      if (!context.user) {
        throw new Error(
          'Need to be logged in to change archive status of notes.',
        )
      }

      return Note.findOne({ _id: noteId, user: context.user }).then((note) => {
        if (note.archivedAt) {
          // eslint-disable-next-line no-param-reassign
          note.archivedAt = null
        } else {
          // eslint-disable-next-line no-param-reassign
          note.archivedAt = new Date()
        }

        return note.save()
      })
    },
    toggleDeletedNote(root, { noteId }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to delete notes.')
      }
      return Note.findOne({ _id: noteId, user: context.user }).then((note) => {
        if (!note) {
          throw new Error('Resource could not be found.')
        }

        if (note.deletedAt) {
          // eslint-disable-next-line no-param-reassign
          note.deletedAt = null
        } else {
          // eslint-disable-next-line no-param-reassign
          note.deletedAt = new Date()
        }
        return note.save()
      })
    },
    requestNewCredential(root, { purpose }, { user }) {
      if (!user) {
        throw new Error('Need to be logged in to request new credentials.')
      }

      if (user.credentials[purpose]) {
        throw new Error(`Credential for this purpose (${purpose}) already set.`)
      }

      return requestNewCredential(user._id, purpose)
    },
    revokeCredential(root, { purpose }, { user }) {
      if (!user) {
        throw new Error('Need to be logged in to revoke credentials.')
      }

      if (!user.credentials[purpose]) {
        throw new Error(
          `Credential for this purpose (${purpose}) hasn't been created.`,
        )
      }

      return revokeCredential(user._id, purpose)
    },
  },
}

// Put schema together into one array of schema strings
// and one map of resolvers, like makeExecutableSchema expects
export const typeDefs = [schemaDefinition]
export const resolvers = rootResolvers

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export default executableSchema
