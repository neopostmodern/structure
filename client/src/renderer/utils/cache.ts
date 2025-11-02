import { ApolloCache } from '@apollo/client'
import { apolloClient, cachePersistor } from '../apollo'

export const clearApolloCache = () => {
  localStorage.clear()
  apolloClient.clearStore()
  cachePersistor.purge()
}

export const removeEntityFromCache = (
  cache: ApolloCache<any>,
  entity: { _id: string; __typename: string },
): void => {
  const normalizedId = cache.identify(entity)
  cache.evict({ id: normalizedId })
  cache.gc() // https://stackoverflow.com/questions/63192774/apollo-client-delete-item-from-cache#comment121727251_66713628
  return
}
