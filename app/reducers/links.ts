export type TagObject = {
  _id: string
  name: string
  color: string
}
export type NoteObject = {
  __typename: 'Link' | 'Text'
  _id: string
  url?: string
  domain?: string
  name: string
  description: string
  tags: Array<TagObject>
  createdAt: number // todo: Date
  archivedAt: number | null // todo: Date
}

