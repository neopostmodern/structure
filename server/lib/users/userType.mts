import type { ObjectId } from 'mongoose'
import type { BaseType } from '../util/baseObject.mts'

export type UserType = BaseType & {
  authenticationProvider: string
  name: string
  tokens: Array<{
    _id: ObjectId
    purpose: string
    token: string
    comment?: string | null
    createdAt: Date
  }>
  internal: {
    ownershipTagId: string
  }
}
