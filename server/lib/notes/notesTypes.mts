import type { TagType } from '../tags/tagType.mts'
import type { UserType } from '../users/userType.mts'
import type { BaseType } from '../util/baseObject.mts'

export type NoteType = BaseType & {
  name: string
  url?: string
  domain?: string
  path?: string
  description: string
  user: UserType
  tags: Array<TagType>
  changedAt: Date
  archivedAt?: Date
  deletedAt?: Date
}
