import { GraphQLErrorCodes } from '@structure/common'
import { GraphQLError } from 'graphql'
import Moment from 'moment/moment.js'
import type { NoteResolvers, QueryNotesArgs } from '../graphQLTypes.d.ts'
import { Tag } from '../tags/tagModel.mts'
import { baseTagsQuery } from '../tags/tagsMethods.mts'
import { getCachedUser } from '../users/methods/getCachedUser.mts'
import { logger } from '../util/logging.mts'
import {
  baseNotesQuery,
  fetchTitleSuggestions,
  leanTypeEnumFixer,
  submitLink,
} from './notesMethods.mts'
import { Link, Note, Text } from './notesModels.mts'

const INoteResolvers = {
  async tags(note, args, context) {
    if (note.tags) {
      return note.tags.filter(
        (tag) => tag.permissions[context.user._id].tag.read,
      )
    }

    return Tag.find({
      ...baseTagsQuery(context.user, 'read'),
      _id: { $in: note.tags },
    }).lean()
  },
  async user(note, args, context) {
    if (note.user && note.user._id) {
      return note.user
    }

    return getCachedUser(note.user, context.user)
  },
}

export const notesResolvers: NoteResolvers = {
  // @ts-ignore
  Link: INoteResolvers,
  Text: INoteResolvers,
  Note: {
    __resolveType(obj, context, info) {
      // console.log("__resolveType", obj.type, obj.type[0].toUpperCase() + obj.type.substring(1).toLowerCase());
      return obj.type[0].toUpperCase() + obj.type.substring(1).toLowerCase()
    },
  },
  Query: {
    async notes(root, { offset, limit }: QueryNotesArgs, { user }) {
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
    async link(root, { linkId }, { user }) {
      if (!user) {
        throw new Error('Need to be logged in to fetch a link.')
      }
      const link = await Link.findOne({
        _id: linkId,
        ...(await baseNotesQuery(user, 'read')),
      }).lean()
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
        logger.warn(`Failed to fetch title suggestions for ${linkId}`, error)
        return []
      }
    },
  },
  Mutation: {
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
        name: title || Moment().format('dddd, MMMM Do YYYY'),
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
  },
}
