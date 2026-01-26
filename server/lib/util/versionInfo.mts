import { gql } from 'graphql-tag'
import packageJson from '../../package.json' with { type: 'json' }

export const versionInfoSchema = gql`
  type Versions {
    minimum: String
    current: String!
  }

  extend type Query {
    versions(currentVersion: String): Versions!
  }
`
export const versionInfoResolver = {
  Query: {
    versions(root, { currentVersion }) {
      return {
        minimum: currentVersion.split('.')[1] !== '25' ? '0.25.0' : null,
        current: packageJson.version,
      }
    },
  },
}
