import { entitiesUpdatedSince } from './methods/entitiesUpdatedSince.mts'

export const cacheResolvers = {
  Query: {
    async entitiesUpdatedSince(root, { cacheId }, { user }) {
      return entitiesUpdatedSince(cacheId, user)
    },
  },
}
