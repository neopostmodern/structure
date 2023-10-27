import { UserType } from '../users/userType'
import { BaseType } from '../util/baseObject'

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
}
