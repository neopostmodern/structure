import { TagType } from '../tags/tagType'
import { UserType } from '../users/userType'
import { BaseType } from '../util/baseObject'

export type NoteType = BaseType & {
  name: string
  description: string
  user: UserType
  tags: Array<TagType>
  archivedAt?: Date
  deletedAt?: Date
}

export type TextType = NoteType
export type LinkType = NoteType & {
  url: string
  domain: string
  path: string
}
