import { getPatch } from 'fast-array-diff'
import { BaseType } from '../../util/baseObject'

type DiffComparator<T> = (cacheEntry: string, dataEntry: T) => boolean

export const cacheGetPatch = <T extends BaseType>(
  data: Array<T>,
  cache: Array<string>,
  {
    checkAgainstId,
    customDiffComparator,
  }: {
    checkAgainstId: boolean
    customDiffComparator: DiffComparator<T>
  } = {
    checkAgainstId: true,
    customDiffComparator: undefined,
  },
) => {
  let diffComparator: DiffComparator<T>
  if (customDiffComparator) {
    diffComparator = customDiffComparator
  } else if (checkAgainstId) {
    // @ts-ignore
    diffComparator = (cacheEntry, dataEntry) => dataEntry._id.equals(cacheEntry)
  }
  return getPatch(cache, data as any, diffComparator as any)
}
