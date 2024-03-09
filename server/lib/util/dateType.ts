import gql from 'graphql-tag'
import { GraphQLScalarType, Kind } from 'graphql/index'

export const dateTypeSchema = gql`
  scalar Date
`

export const dateTypeResolver = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value: number) {
      return new Date(value) // value from the client
    },
    serialize(value: Date) {
      return value.getTime() // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10) as any // ast value is always in string format
      }
      return null
    },
  }),
}
