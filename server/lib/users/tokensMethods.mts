import crypto from 'crypto'

import { User } from './userModel.mts'
import type { UserType } from './userType.mts'

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export async function issueToken(userId, purpose: string, comment = null) {
  const rawToken = crypto.randomBytes(10).toString('hex')

  const user = await User.findOne({ _id: userId })

  user.tokens.push({
    purpose,
    token: hashToken(rawToken),
    comment,
  } as UserType['tokens'][number])
  user.markModified('tokens')

  await user.save()

  return rawToken
}

export async function revokeToken(userId, tokenId: string) {
  const user = await User.findOne({ _id: userId })

  // eslint-disable-next-line no-param-reassign
  user.tokens = user.tokens.filter((token) => token._id.toString() !== tokenId)
  user.markModified('tokens')

  return user.save()
}

export function getUserByToken(rawToken: string) {
  if (!rawToken) {
    return Promise.resolve(null)
  }

  return User.findOne({
    tokens: { $elemMatch: { token: hashToken(rawToken) } },
  }).lean()
}
