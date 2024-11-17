import { gql } from 'graphql-tag'
import { ObjectId, Schema } from 'mongoose'

export interface BaseType {
  _id: ObjectId
  createdAt: Date
  updatedAt: Date
}

export const baseObjectSchema = gql`
  interface BaseObject {
    _id: ID!
    createdAt: Date!
    updatedAt: Date!
  }
`
export const withBaseSchema = <T extends BaseType>(
  schemaDefinition,
  schemaOptions = {},
) => {
  return new Schema<T>(schemaDefinition, { timestamps: true, ...schemaOptions })
}
