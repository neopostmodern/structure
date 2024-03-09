import { entitiesUpdatedSince } from './methods/entitiesUpdatedSince'

export const cacheResolvers = {
  Query: {
    async entitiesUpdatedSince(root, { cacheId }, { user }) {
      return entitiesUpdatedSince(cacheId, user)
    },
  },
}
