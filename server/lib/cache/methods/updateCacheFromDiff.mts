import { Cache } from '../cacheModel.mts'

export const updateCacheFromDiff = async (
  user,
  cacheId,
  cacheFieldName,
  diff,
) => {
  const cacheValueFieldName = `value.${cacheFieldName}`

  for (const patch of diff.patch) {
    if (patch.type === 'add') {
      await Cache.updateOne(
        { _id: cacheId, user },
        {
          $push: {
            [cacheValueFieldName]: {
              $each: patch.items.map(({ _id }) => _id),
              $position: patch.newPos,
            },
          },
        },
      )
    } else {
      // todo: could join all removes!
      await Cache.updateOne(
        { _id: cacheId, user },
        {
          $pull: {
            [cacheValueFieldName]: { $in: patch.items.map(({ _id }) => _id) },
          },
        },
      )
    }
  }
}
