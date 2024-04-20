import { GraphQLErrorCodes, INTERNAL_TAG_PREFIX } from '@structure/common'
import { GraphQLError } from 'graphql/index'
import { TagPermissionsArgs } from '../graphQLTypes'
import { leanTypeEnumFixer } from '../notes/notesMethods'
import { Note } from '../notes/notesModels'
import { getCachedUser } from '../users/methods/getCachedUser'
import { User } from '../users/userModel'
import { Tag } from './tagModel'
import {
  addTagByNameToNote,
  baseTagsQuery,
  createTagObject,
  MINIMAL_PERMISSIONS,
  removeTagByIdFromNote,
} from './tagsMethods'

export const tagsResolvers = {
  Tag: {
    async notes(tag, args, context) {
      if (tag._id.equals(context.user.internal.ownershipTagId)) {
        return []
      }
      if (tag.notes && context.__skip_notes_population) {
        return tag.notes
      }
      // todo: check permissions!
      //  (test: B shares N with A. A adds tag Y to N. B unshares (by untagging X) N, then A should not see N despite it having the tag Y.
      const notes = await Note.find({ tags: tag, deletedAt: null }).lean()
      return leanTypeEnumFixer(notes)
    },
    async user(tag, args, context) {
      // console.log('tag.user', tag.user)
      if (tag.user && tag.user._id) {
        // console.log('shortcut!')
        return tag.user
      }
      return getCachedUser(tag.user, context.user)
    },
    permissions(tag, { onlyMine }: TagPermissionsArgs, { user }, info) {
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
  Query: {
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

      await tag.deleteOne()

      context.__skip_notes_population = true
      ;(tag as any).notes = updatedNotes

      return tag
    },
    async shareTag(root, { tagId, username }, { user }) {
      if (!user) {
        throw new Error('Need to be logged in to share a tag.')
      }

      const tag = await Tag.findOne({
        _id: tagId,
        ...baseTagsQuery(user, 'share'),
      })
      if (!tag) {
        throw new Error('No such tag or no sufficient privileges.')
      }

      const targetUser = await User.findOne({ name: username }).lean()
      if (!targetUser) {
        throw new Error(`No such user: ${username}`)
      }

      tag.permissions.set(targetUser._id.toString(), MINIMAL_PERMISSIONS)

      return tag.save()
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
    async unshareTag(root, { tagId, userId }, { user }) {
      if (!user) {
        throw new Error('Need to be logged in to update permissions.')
      }

      const tag = await Tag.findOne({
        _id: tagId,
        // always allow unsharing from yourself
        ...(user._id === userId ? {} : baseTagsQuery(user, 'share')),
      })
      if (!tag) {
        throw new Error('No such tag or no sufficient privileges.')
      }

      if (tag.user === userId) {
        throw new Error("Can't unshare tag from owner")
      }

      if (!tag.permissions.has(userId)) {
        throw new Error('Tag not shared with user.')
      }

      tag.permissions.delete(userId)

      return tag.save()
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
  },
}
