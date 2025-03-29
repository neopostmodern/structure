import type { TagsQuery } from '../generated/graphql';

export type Loadable<T> = T | 'loading';
export type OptionalReactComponent = JSX.Element | null | undefined | false;

export type DisplayOnlyTag = Pick<
  TagsQuery['tags'][number],
  '_id' | 'name' | 'color' | 'user' | 'permissions'
>;
