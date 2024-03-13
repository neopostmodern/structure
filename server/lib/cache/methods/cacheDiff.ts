import { BaseType } from '../../util/baseObject'
import { cacheGetPatch } from './cacheGetPatch'

export const cacheDiff = <T extends BaseType>(
  entities: Array<T>,
  cachedIds: Array<string>,
  { cacheUpdatedAt }: { cacheUpdatedAt: Date },
) => {
  const entitiesPatch = cacheGetPatch(entities, cachedIds)
  const cachePatch = {
    added: [],
    removedIds: [],
    updated: [],
    patch: entitiesPatch,
  }
  entitiesPatch.forEach((patch) => {
    if (patch.type === 'add') {
      cachePatch.added = cachePatch.added.concat(patch.items)
    } else {
      cachePatch.removedIds = cachePatch.removedIds.concat(patch.items)
    }
  })
  cachePatch.updated = entities.filter(
    (entity) =>
      entity.updatedAt > cacheUpdatedAt && !cachePatch.added.includes(entity),
  )
  return cachePatch
}
