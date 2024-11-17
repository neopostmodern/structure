import type { UserType } from '../users/userType.mts'
import type { BaseType } from '../util/baseObject.mts'

export type TagType = BaseType & {
  name: string
  user: UserType
  color: string
  permissions: {
    [userId: string]: {
      tag: {
        read: boolean
        write: boolean
        use: boolean
        share: boolean
      }
      notes: {
        read: boolean
        write: boolean
      }
    }
  }
  changedAt: Date
}
