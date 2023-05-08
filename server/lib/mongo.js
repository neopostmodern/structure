import { urlAnalyzer } from '@structure/common'
import config from '@structure/config'
import mongoose from 'mongoose'

// named import isn't working at the moment
const { Schema } = mongoose

await mongoose.connect(config.MONGO_URL)
mongoose.set('debug', config.MONGOOSE_DEBUG)
mongoose.set('strictQuery', 'throw')

export const withBaseSchema = (schemaDefinition, schemaOptions = {}) => {
  return new Schema(schemaDefinition, { timestamps: true, ...schemaOptions })
}

const metaSchema = withBaseSchema({
  _id: String,
  value: {},
})
export const Meta = mongoose.model('Meta', metaSchema)

const userSchema = withBaseSchema(
  {
    _id: String,
    name: String,
    authenticationProvider: String,
    credentials: {
      type: {
        bookmarklet: {
          type: String,
          optional: true,
        },
        rss: {
          type: String,
          optional: true,
        },
      },
      default: {},
    },
    internal: {
      ownershipTagId: String,
    },
  },
  {
    minimize: false,
  },
)
export const User = mongoose.model('User', userSchema)

const noteOptions = { discriminatorKey: 'type' }
const noteSchema = withBaseSchema(
  {
    name: String,
    description: { type: String, default: '' },
    user: { type: String, ref: 'User' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag', index: true }],
    archivedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
  },
  noteOptions,
)
export const Note = mongoose.model('Note', noteSchema)

const textSchema = Schema({}, noteOptions)
export const Text = Note.discriminator('Text', textSchema)

const linkSchema = Schema(
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
export const Link = Note.discriminator('Link', linkSchema)

const tagSchema = withBaseSchema({
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
export const Tag = mongoose.model('Tag', tagSchema)

const cacheSchema = withBaseSchema({
  user: { type: String, ref: 'User', index: true },
  value: {},
})
export const Cache = mongoose.model('Cache', cacheSchema)

const clearOldCaches = async () => {
  console.log('Clearing old caches...')
  await Cache.deleteMany({
    updatedAt: {
      $lt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    },
  })
}

// once a day delete cache entries that have not been updated for 30 days
setInterval(clearOldCaches, 24 * 60 * 60 * 1000)
// run once at startup
setImmediate(clearOldCaches)
