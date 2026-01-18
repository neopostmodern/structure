import { GraphQLErrorCodes } from '@structure/common'
import { GraphQLError } from 'graphql'
import type { NoteResolvers, QueryNotesArgs } from '../graphQLTypes.d.ts'
import { Tag } from '../tags/tagModel.mts'
import { baseTagsQuery } from '../tags/tagsMethods.mts'
import { getCachedUser } from '../users/methods/getCachedUser.mts'
import { logger } from '../util/logging.mts'
import {
  baseNotesQuery,
  createNote,
  fetchTitleSuggestions,
} from './notesMethods.mts'
import { Note } from './notesModels.mts'

export const notesResolvers: NoteResolvers = {
  Note: {
    async tags(note, args, context) {
      if (note.tags && note.tags.every((tag) => 'permissions' in tag)) {
        return note.tags.filter(
          (tag) => tag.permissions[context.user._id]?.tag.read,
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
    },
    async note(root, { noteId }, { user }) {
      if (!user) {
        throw new Error('Need to be logged in to fetch a note.')
      }
      const note = await Note.findOne({
        _id: noteId,
        ...(await baseNotesQuery(user, 'read')),
      }).lean()
      if (!note) {
        throw new GraphQLError(
          `No note with ID '${noteId}' found for this user.`,
          {
            extensions: {
              code: GraphQLErrorCodes.ENTITY_NOT_FOUND,
            },
          },
        )
      }
      return note
    },
    async titleSuggestions(root, { noteId }, { user }) {
      if (!user) {
        throw new Error('Need to be logged in to fetch title suggestions.')
      }
      const note = await Note.findOne({
        _id: noteId,
        ...(await baseNotesQuery(user, 'write')),
      })
      if (!note) {
        throw new Error(`No note with ID ${noteId} or no sufficient privileges`)
      }
      if (!note.url) {
        logger.warn(
          `Title suggestions were requested for note ${noteId} which has no URL.`,
        )
        return []
      }
      try {
        return fetchTitleSuggestions(note.url)
      } catch (error) {
        logger.warn(`Failed to fetch title suggestions for ${noteId}`, error)
        return []
      }
    },
  },
  Mutation: {
    createNote(root, { url, title, description }, context) {
      if (!context.user) {
        throw new Error('Need to be logged in to create notes.')
      }
      return createNote(context.user, { url, title, description })
    },
    async updateNote(root, { note: { _id, ...props } }, { user }) {
      if (!user) {
        throw new Error('Need to be logged in to update notes.')
      }
      return Note.findOne({
        _id,
        ...(await baseNotesQuery(user, 'write')),
      }).then((note) => {
        if (!note) {
          throw new Error('Resource could not be found.')
        }

        if (note.updatedAt > props.updatedAt) {
          throw new Error(
            'Note has been changed externally since last sync, change rejected.',
          )
        }

        Object.entries(props).forEach(([propName, propValue]) => {
          note[propName] = propValue
        })
        return note.save()
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
