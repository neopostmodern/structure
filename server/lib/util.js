import { internalTagNameForOwnership } from '@structure/common'
import { getPatch } from 'fast-array-diff'
import { Tag, User } from './mongo.js'

export const cacheGetPatch = (
  data,
  cache,
  { checkAgainstId, customDiffComparator } = { checkAgainstId: true },
) => {
  let diffComparator
  if (customDiffComparator) {
    diffComparator = customDiffComparator
  } else if (checkAgainstId) {
    diffComparator = (cacheEntry, dataEntry) => dataEntry._id.equals(cacheEntry)
  }
  return getPatch(cache, data, diffComparator)
}

export const cacheDiff = (entities, cachedIds, { cacheUpdatedAt }) => {
  const entitiesPatch = cacheGetPatch(entities, cachedIds)
  const cachePatch = {
    added: [],
    removedIds: [],
    patch: entitiesPatch,
  }
  entitiesPatch.forEach((patch) => {
    if (patch.type === 'add') {
      cachePatch.added = cachePatch.added.concat(patch.items)
    } else {
      cachePatch.removedIds = cachePatch.removedIds.concat(patch.items)
    }
  })
  cachePatch.updated = entities.filter(
    (entity) =>
      entity.updatedAt > cacheUpdatedAt && !cachePatch.added.includes(entity),
  )
  return cachePatch
}

export const leanTypeEnumFixer = (notes) =>
  notes.map((note) => ({ ...note, type: note.type.toUpperCase() }))

export const basePermissionsQueryOnTags = (user, resource, mode = 'read') => ({
  [`permissions.${user._id}.${resource}.${mode}`]: true,
})
export const baseTagsQuery = (user, mode = 'read') =>
  basePermissionsQueryOnTags(user, 'tag', mode)
export const baseNotesQuery = async (user, mode = 'read') => {
  const tagIdsWithNoteReadPermissionAndSharing = await Tag.aggregate([
    {
      $match: {
        ...basePermissionsQueryOnTags(user, 'notes', mode),
      },
    },
    {
      $match: {
        $expr: {
          $gte: [{ $size: { $objectToArray: '$permissions' } }, 2],
        },
      },
    },
    {
      $project: {
        _id: 1,
      },
    },
  ])

  return {
    tags: {
      $in: [
        user.internal.ownershipTagId,
        ...tagIdsWithNoteReadPermissionAndSharing,
      ],
    },
  }
}

export const ALL_PERMISSIONS = {
  tag: {
    read: true,
    write: true,
    use: true,
    share: true,
  },
  notes: {
    read: true,
    write: true,
  },
}

export const createTagObject = ({ name, color = 'lightgray', user }) => ({
  name,
  color,
  user,
  permissions: new Map([[user._id, ALL_PERMISSIONS]]),
})

/**
 * Create the special ownership tag for the user and store the tag's ID on the user
 * @param user User to create ownership tag for
 * @returns {Promise<User>} The saved user object
 */
export const createOwnershipTagOnUser = async (user) => {
  const userTag = await new Tag(
    createTagObject({
      name: internalTagNameForOwnership(user.name),
      user,
    }),
  ).save()

  user.internal.ownershipTagId = userTag._id

  return user.save({ timestamps: false })
}

export const getCachedUser = async (userId, contextUser) => {
  const userIdUnpacked = userId._id || userId

  if (contextUser?._id === userIdUnpacked) {
    const { _id, name } = contextUser
    return { _id, name }
  }

  return User.findById(userId, { name: 1 }).lean()
}
