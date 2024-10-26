import type Mongoose from 'mongoose'
import mongoose, { Schema } from 'mongoose'
import { withBaseSchema } from '../util/baseObject'
import { TagType } from './tagType'

type MongooseTagType = Omit<TagType, 'permissions'> & {
  permissions: Mongoose.Types.Map<TagType['permissions'][string]>
}

const tagSchema = withBaseSchema<MongooseTagType>({
  changedAt: { type: Date, default: Date.now },
  user: { type: String, ref: 'User', index: true },
  name: String,
  color: String,
  permissions: {
    type: Map,
    of: new Schema({
      tag: {
        read: Boolean,
        write: Boolean,
        use: Boolean,
        share: Boolean,
      },
      notes: {
        read: Boolean,
        write: Boolean,
      },
    }),
  },
})

tagSchema.pre('save', function (next) {
  if (this.modifiedPaths().some((path) => ['name', 'color'].includes(path))) {
    this.changedAt = new Date()
  }
  next()
})

export const Tag = mongoose.model<MongooseTagType>('Tag', tagSchema)
