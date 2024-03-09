import { requestNewCredential, revokeCredential } from './credentialsMethods'
import { getCachedUser } from './methods/getCachedUser'

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
