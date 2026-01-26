import { ApolloCache } from '@apollo/client'
import { apolloClient, cachePersistor } from '../apollo'

export const clearApolloCache = () => {
  localStorage.clear()
  apolloClient.clearStore()
  cachePersistor.purge()
}

export const removeEntityFromCache = (
  cache: ApolloCache,
  entity: { _id: string; __typename: string },
): void => {
  const normalizedId = cache.identify(entity)
  cache.evict({ id: normalizedId })
  cache.gc() // https://stackoverflow.com/questions/63192774/apollo-client-delete-item-from-cache#comment121727251_66713628
  return
}

export const cacheRefUpdater =
  <T extends { _id: string }>(
    typename: string,
    addedEntities: Array<T>,
    removedEntityIds: Array<string>,
  ) =>
  (currentRefs: Readonly<Array<{ __ref: string }>>) => {
    let newRefs = currentRefs.concat(
      // filter out entities that are already in cache (because they were created locally)
      // and then convert remaining IDs to refs
      addedEntities
        .filter(
          ({ _id }) =>
            !currentRefs.some(
              (cacheRef) => cacheRef.__ref.split(':')[1] === _id,
            ),
        )
        .map(({ _id }) => ({
          __ref: `${typename}:${_id}`,
        })),
    )
    if (removedEntityIds.length) {
      newRefs = newRefs.filter(
        (cacheRef) => !removedEntityIds.includes(cacheRef.__ref.split(':')[1]),
      )
    }
    return newRefs
  }
