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

// Unlike requestNewCredential, this doesn't throw if a credential already
// exists for this purpose - it's meant for flows (like OAuth logins) that can
// legitimately run more than once for the same user.
export function getOrCreateCredential(userId, purpose) {
  return User.findOne({ _id: userId }).then((user) => {
    if (user.credentials[purpose]) {
      return user.credentials[purpose]
    }

    // eslint-disable-next-line no-param-reassign
    user.credentials[purpose] = crypto.randomBytes(10).toString('hex')
    user.markModified('credentials')

    return user.save().then(() => user.credentials[purpose])
  })
}

export function getUserByCredential(purpose, token) {
  if (!token) {
    return Promise.resolve(null)
  }

  return User.findOne({ [`credentials.${purpose}`]: token }).lean()
}
