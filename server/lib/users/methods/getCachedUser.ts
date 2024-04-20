import { User } from '../userModel'

export const getCachedUser = async (userId, contextUser) => {
  const userIdUnpacked = userId._id || userId

  if (contextUser?._id === userIdUnpacked) {
    const { _id, name } = contextUser
    return { _id, name }
  }

  console.log(`Request ${userIdUnpacked}`, userId)

  return User.findById(userId, { name: 1 }).lean()
}
