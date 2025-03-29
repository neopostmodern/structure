import type { BaseType } from '../../util/baseObject.mts'
import { timerEnd, timerStart } from '../../util/logging.mts'
import { cacheGetPatch } from './cacheGetPatch.mts'

export const cacheDiff = <T extends BaseType>(
  entities: Array<T>,
  cachedIds: Array<string>,
  { cacheUpdatedAt }: { cacheUpdatedAt: Date },
) => {
  if (cacheUpdatedAt.getTime() === 0) {
    return {
      added: entities,
      removedIds: [],
      updated: [],
      patch: { type: 'add', newPos: 0, oldPos: 0, items: entities },
    }
  }

  timerStart('cacheDiff: cacheGetPatch')
  const entitiesPatch = cacheGetPatch(entities, cachedIds)
  timerEnd('cacheDiff: cacheGetPatch')
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
