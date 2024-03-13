import { BaseType } from '../util/baseObject'

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
