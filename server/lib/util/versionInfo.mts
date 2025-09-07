import { gql } from 'graphql-tag'
import packageJson from '../../package.json' with { type: 'json' }

export const versionInfoSchema = gql`
  type Versions {
    minimum: String
    current: String!
    recommended: String
      @deprecated(reason: "Upgrade to 0.20.0+ and use 'current' field")
  }

  extend type Query {
    versions(currentVersion: String): Versions!
  }
`
export const versionInfoResolver = {
  Query: {
    versions(root, { currentVersion }) {
      if (currentVersion) {
        return {
          minimum: currentVersion.split('.')[1] !== '24' ? '0.24.1' : null,
          current: packageJson.version,
        }
      }

      // backward compatibility < 0.20.0
      return {
        minimum: 8,
        recommended: 8,
      }
    },
  },
}
