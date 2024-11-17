import { internalTagNameForOwnership } from '@structure/common'
import { Tag } from '../../tags/tagModel.mts'
import { createTagObject } from '../../tags/tagsMethods.mts'

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
