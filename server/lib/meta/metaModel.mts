import mongoose from 'mongoose'
import { withBaseSchema } from '../util/baseObject.mts'
import type { MetaType } from './metaType.mts'

const metaSchema = withBaseSchema<MetaType>({
  _id: String,
  value: {},
})
export const Meta = mongoose.model('Meta', metaSchema)
