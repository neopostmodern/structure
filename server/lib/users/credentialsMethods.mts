import crypto from 'crypto'

import { User } from './userModel.mts'

export function requestNewCredential(userId, purpose) {
  return User.findOne({ _id: userId }).then((user) => {
    // eslint-disable-next-line no-param-reassign
    user.credentials[purpose] = crypto.randomBytes(10).toString('hex')

    user.markModified('credentials')

    return user.save()
  })
}

export function revokeCredential(userId, purpose) {
  return User.findOne({ _id: userId }).then((user) => {
    // eslint-disable-next-line no-param-reassign
    delete user.credentials[purpose]
    user.markModified('credentials')

    return user.save()
  })
}
