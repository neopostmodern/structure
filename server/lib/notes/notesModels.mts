import mongoose, { Schema } from 'mongoose'

import { urlAnalyzer } from '@structure/common'
import { withBaseSchema } from '../util/baseObject.mts'
import type { LinkType, NoteType, TextType } from './notesTypes.mts'

const noteOptions = { discriminatorKey: 'type' }
const noteSchema = withBaseSchema<NoteType>(
  {
    name: String,
    description: { type: String, default: '' },
    user: { type: String, ref: 'User' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag', index: true }],
    archivedAt: { type: Date, default: null },
    changedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
  },
  noteOptions,
)
noteSchema.pre('save', function (next) {
  if (
    this.modifiedPaths().some((path) =>
      ['name', 'description', 'url'].includes(path),
    )
  ) {
    this.changedAt = new Date()
  }
  next()
})
export const Note = mongoose.model<NoteType>('Note', noteSchema)
const textSchema = new Schema<TextType>({}, noteOptions)
export const Text = Note.discriminator<TextType>('Text', textSchema)
export const linkSchema = new Schema<LinkType>(
  {
    url: String,
    domain: String,
    path: String,
  },
  noteOptions,
)
linkSchema.pre('save', function (next) {
  const { shortDomain, path, suggestedName } = urlAnalyzer(this.url)
  this.domain = shortDomain
  this.path = path
  if (typeof this.name === 'undefined' || this.name.length === 0) {
    this.name = suggestedName
  }
  next()
})
export const Link = Note.discriminator<LinkType>('Link', linkSchema)
