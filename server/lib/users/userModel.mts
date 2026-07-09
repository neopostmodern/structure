import mongoose from 'mongoose'

import { withBaseSchema } from '../util/baseObject.mts'
import type { UserType } from './userType.mts'

const userSchema = withBaseSchema<UserType>(
  {
    _id: String,
    name: String,
    authenticationProvider: String,
    tokens: [
      {
        purpose: { type: String, required: true },
        token: { type: String, required: true },
        comment: { type: String, default: null },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    internal: {
      ownershipTagId: String,
    },
  },
  {
    minimize: false,
  },
)
export const User = mongoose.model('User', userSchema)
