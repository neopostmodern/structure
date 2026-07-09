import { getCachedUser } from './methods/getCachedUser.mts'
import { issueToken, revokeToken } from './tokensMethods.mts'
import { User } from './userModel.mts'

export const userResolvers = {
  UserPermissions: {
    async user(userPermission, args, context) {
      return getCachedUser(userPermission.user, context.user)
    },
  },
  Query: {
    currentUser(root, args, context) {
      return context.user || null
    },
  },
  Mutation: {
    async createToken(root, { comment }, { user }) {
      if (!user) {
        throw new Error('Need to be logged in to create tokens.')
      }

      const rawToken = await issueToken(user._id, 'user', comment)
      const updatedUser = await User.findById(user._id).lean()

      return { rawToken, user: updatedUser }
    },
    revokeToken(root, { tokenId }, { user }) {
      if (!user) {
        throw new Error('Need to be logged in to revoke tokens.')
      }

      if (!user.tokens.some((token) => token._id.toString() === tokenId)) {
        throw new Error(`Token ${tokenId} not found.`)
      }

      return revokeToken(user._id, tokenId)
    },
  },
}
