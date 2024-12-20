import mongoose from 'mongoose'

import { withBaseSchema } from '../util/baseObject.mts'
import type { UserType } from './userType.mts'

const userSchema = withBaseSchema<UserType>(
  {
    _id: String,
    name: String,
    authenticationProvider: String,
    credentials: {
      type: {
        bookmarklet: {
          type: String,
          optional: true,
        },
        rss: {
          type: String,
          optional: true,
        },
      },
      default: {},
    },
    internal: {
      ownershipTagId: String,
    },
  },
  {
    minimize: false,
  },
)
export const User = mongoose.model('User', userSchema)
