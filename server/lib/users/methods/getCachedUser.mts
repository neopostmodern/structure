import { User } from '../userModel.mts'

export const getCachedUser = async (userId, contextUser) => {
  const userIdUnpacked = userId._id || userId

  if (contextUser?._id === userIdUnpacked) {
    const { _id, name } = contextUser
    return { _id, name }
  }

  return User.findById(userId, { name: 1 }).lean()
}
