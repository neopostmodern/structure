export * from './linkGenerator'
export * from './migrationSystem'
export * from './urlAnalyzer'

export enum GraphQLErrorCodes {
  'ENTITY_NOT_FOUND' = 'ENTITY_NOT_FOUND',
}

export const INTERNAL_TAG_PREFIX = '__structure'
export const INTERNAL_TAG_PREFIX_OWNERSHIP = `${INTERNAL_TAG_PREFIX}:owned-by`
export const internalTagNameForOwnership = (userName: string) =>
  `${INTERNAL_TAG_PREFIX_OWNERSHIP}:${userName}`
