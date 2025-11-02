// eslint-disable-next-line import/prefer-default-export
export const stripTypename = <T>(object: T): T => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const { __typename: _, ...cleanObject } = object as any
  return cleanObject
}
