import mongoose from 'mongoose'
import { withBaseSchema } from '../util/baseObject'
import { MetaType } from './metaType'

const metaSchema = withBaseSchema<MetaType>({
  _id: String,
  value: {},
})
export const Meta = mongoose.model('Meta', metaSchema)
