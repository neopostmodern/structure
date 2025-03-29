import type { BaseType } from '../util/baseObject.mts'

export type UserType = BaseType & {
  authenticationProvider: string
  name: string
  credentials: {
    bookmarklet?: string
    rss?: string
  }
  internal: {
    ownershipTagId: string
  }
}
