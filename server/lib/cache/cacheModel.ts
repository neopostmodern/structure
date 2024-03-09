import mongoose from 'mongoose'
import { withBaseSchema } from '../util/baseObject'
import { CacheType } from './cacheType'

const cacheSchema = withBaseSchema<CacheType>({
  user: { type: String, ref: 'User', index: true },
  value: {},
})
export const Cache = mongoose.model('Cache', cacheSchema)
