import { makeExecutableSchema } from '@graphql-tools/schema'
import { GraphQLScalarType, Kind } from 'graphql'
import Moment from 'moment'
import packageJson from '../package.json' assert { type: 'json' }
import {
  addTagByNameToNote,
  fetchTitleSuggestions,
  removeTagByIdFromNote,
  requestNewCredential,
  revokeCredential,
  submitLink,
} from './methods.js'
import { Link, Note, Tag, Text } from './mongo.js'
import schemaDefinition from './schema.js'

const INoteResolvers = {
  async tags(note, args, context) {
    return Tag.find({ _id: { $in: note.tags } })
  },
}
const typeEnumFixer = (notes) =>
  // eslint-disable-next-line no-underscore-dangle
  notes.map((note) =>
    Object.assign({}, note._doc, { type: note.type.toUpperCase() }),
  )

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
      return Note.find({ tags: tag, deletedAt: null }).then(typeEnumFixer)
    },
  },
  Query: {
    currentUser(root, args, context) {
      return context.user || null
    },
    versions(root, { currentVersion }) {
      if (currentVersion) {
        return {
          // todo: return the minimum required version depending on the client's current version
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
    async notes(root, { offset, limit }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to fetch links.')
      }
      const protectedLimit = limit < 1 || limit > 10 ? 10 : limit
      return Note.find({ user: context.user, deletedAt: null })
        .sort({ createdAt: -1 })
        .limit(protectedLimit)
        .exec()
        .then(typeEnumFixer)
    },
    async entitiesUpdatedSince(root, { updatedSince }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to fetch links.')
      }
      const updatedSinceAsDate = new Date(updatedSince)
      const filter = {
        user: context.user,
        updatedAt: { $gt: updatedSinceAsDate },
      }
      return {
        notes: await Note.find(filter)
          .sort({ createdAt: -1 })
          .exec()
          .then(typeEnumFixer),
        tags: Tag.find(filter).exec(),
        timestamp: new Date(),
      }
    },
    async link(root, { linkId }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to fetch a link.')
      }
      return Link.findById(linkId)
    },
    async links(root, { offset, limit }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to fetch links.')
      }
      const protectedLimit = limit < 1 || limit > 10 ? 10 : limit
      return Link.find({ user: context.user, deletedAt: null })
        .sort({ createdAt: -1 })
        .limit(protectedLimit)
        .exec()
    },
    async text(root, { textId }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to fetch a text.')
      }
      return Text.findById(textId)
    },
    async tag(root, { tagId }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to fetch a tag.')
      }
      return Tag.findById(tagId)
    },
    async tags(root, { offset, limit }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to fetch links.')
      }
      const protectedLimit = limit < 1 || limit > 10 ? 10 : limit
      return (
        Tag.find({ user: context.user })
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
      const link = await Link.findById(linkId)
      if (!link) {
        throw new Error(`No link with ID ${linkId}`)
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
      return Tag.findOne({ name, user }).then((tag) => {
        if (tag) {
          throw new Error(`Tag with name '${name}' already exists.`)
        }

        return new Tag({ name, color: color || 'lightgray', user }).save()
      })
    },
    updateTag(root, { tag: { _id, ...props } }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to update tags.')
      }
      return Tag.findOne({ _id, user: context.user }).then((tag) => {
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

      const notes = await Note.find({ tags: tag._id, user }).exec()
      for (const note of notes) {
        updatedNotes.push(await removeTagByIdFromNote(user, note._id, tag._id))
      }

      await tag.remove()

      context.__skip_notes_population = true
      tag.notes = updatedNotes

      console.log('tag after deletion', tag)

      return tag
    },
    submitLink(root, { url, title, description }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to submit links.')
      }
      return submitLink(context.user, { url, title, description })
    },
    updateLink(root, { link: { _id, ...props } }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to update links.')
      }
      return Link.findOne({ _id, user: context.user }).then((link) => {
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

    createText(root, { title, description }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to create texts.')
      }

      return new Text({
        name: title || new Moment().format('dddd, MMMM Do YYYY'),
        description,
        user: context.user,
      }).save()
    },
    updateText(root, { text: { _id, ...props } }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to update texts.')
      }
      return Text.findOne({ _id, user: context.user }).then((text) => {
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
      return addTagByNameToNote(context.user, noteId, name).then(() =>
        Note.findOne({ _id: noteId }),
      )
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
