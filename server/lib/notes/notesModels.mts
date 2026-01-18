import mongoose, { Schema } from 'mongoose'

import { urlAnalyzer } from '@structure/common'
import { withBaseSchema } from '../util/baseObject.mts'
import type { NoteType } from './notesTypes.mts'

const noteOptions = { discriminatorKey: 'type' }
const noteSchema = withBaseSchema<NoteType>(
  {
    name: String,
    url: { type: String, default: null },
    domain: { type: String, default: null },
    path: { type: String, default: null },
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

  if (this.url) {
    const { shortDomain, path, suggestedName } = urlAnalyzer(this.url)
    this.domain = shortDomain
    this.path = path
    if (typeof this.name === 'undefined' || this.name.length === 0) {
      this.name = suggestedName
    }
  } else {
    this.domain = null
    this.path = null
  }

  next()
})
export const Note = mongoose.model<NoteType>('Note', noteSchema)
