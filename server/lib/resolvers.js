import { makeExecutableSchema } from 'apollo-server'
import { GraphQLScalarType, Kind } from 'graphql'
import Moment from 'moment'
import {
  addTagByNameToNote,
  fetchTitleSuggestions,
  requestNewCredential,
  revokeCredential,
  submitLink,
} from './methods.js'
import { Link, Note, Tag, Text } from './mongo.js'
import schemaDefinition from './schema.js'

const INoteResolvers = {
  tags(note, args, context) {
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
    notes(tag, args, context) {
      return Note.find({ tags: tag, deletedAt: null }).then(typeEnumFixer)
    },
  },
  Query: {
    currentUser(root, args, context) {
      return context.user || null
    },
    versions(root, args, context) {
      return {
        minimum: 7,
        recommended: 7,
      }
    },
    notes(root, { offset, limit }, context) {
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
    link(root, { linkId }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to fetch a link.')
      }
      return Link.findById(linkId)
    },
    links(root, { offset, limit }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to fetch links.')
      }
      const protectedLimit = limit < 1 || limit > 10 ? 10 : limit
      return Link.find({ user: context.user, deletedAt: null })
        .sort({ createdAt: -1 })
        .limit(protectedLimit)
        .exec()
    },
    text(root, { textId }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to fetch a text.')
      }
      return Text.findById(textId)
    },
    tag(root, { tagId }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to fetch a tag.')
      }
      return Tag.findById(tagId)
    },
    tags(root, { offset, limit }, context) {
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
        let x = await fetchTitleSuggestions(link.url)
        console.log(link.url, x)
        return x
      } catch (error) {
        console.warn(`Failed to fetch title suggestions for ${linkId}`, error)
        return []
      }
    },
  },
  Mutation: {
    updateTag(root, { tag: { _id, ...props } }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to update tags.')
      }
      return Tag.findOne({ _id, user: context.user }).then((tag) => {
        if (!tag) {
          throw new Error('Resource could not be found.')
        }

        Object.entries(props).forEach(([propName, propValue]) => {
          tag[propName] = propValue
        })
        return tag.save()
      })
    },
    submitLink(root, { url }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to submit links.')
      }
      return submitLink(context.user, url)
    },
    updateLink(root, { link: { _id, ...props } }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to update links.')
      }
      return Link.findOne({ _id, user: context.user }).then((link) => {
        if (!link) {
          throw new Error('Resource could not be found.')
        }

        Object.entries(props).forEach(([propName, propValue]) => {
          link[propName] = propValue
        })
        return link.save()
      })
    },

    createText(root, {}, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to create texts.')
      }

      return new Text({
        name: new Moment().format('dddd, MMMM Do YYYY'),
        user: context.user,
        createdAt: new Date(),
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
    removeTagByIdFromNote(root, { noteId, tagId }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to untag notes.')
      }
      return Note.findOneAndUpdate(
        { _id: noteId, user: context.user },
        { $pull: { tags: tagId } },
      )
        .exec()
        .then(({ _id }) => Note.findOne({ _id }))
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
