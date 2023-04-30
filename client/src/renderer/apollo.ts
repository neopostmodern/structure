import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  setLogVerbosity,
} from '@apollo/client';
import { CachePersistor, LocalForageWrapper } from 'apollo3-cache-persist';
import localforage from 'localforage';

let backendUrl;
if (process.env.TARGET === 'web') {
  // no backend customization for web, other backends should host their own frontends
  backendUrl = BACKEND_URL;
} else {
  backendUrl = localStorage.getItem('backend-url') || BACKEND_URL;

  if (backendUrl.endsWith('structure.neopostmodern.com')) {
    localStorage.setItem('backend-url', BACKEND_URL);
    backendUrl = BACKEND_URL;
  }
}

const cache = new InMemoryCache({
  possibleTypes: {
    INote: ['Link', 'Text'],
  },
  typePolicies: {
    Tag: {
      fields: {
        noteCount: {
          read(_, { readField }) {
            const notesWithTag: readonly unknown[] | undefined =
              readField('notes');
            if (notesWithTag && 'length' in notesWithTag) {
              return notesWithTag.length;
            }
            return 0;
          },
        },
        notes: {
          read(currentValue, { variables: { tagId }, toReference }) {
            if (currentValue) {
              return currentValue;
            }
            return Object.values<{
              __typename: string;
              _id: string;
              tags?: Array<{ __ref: string }>;
            }>(cache.data.data)
              .filter(
                (cacheEntry) =>
                  (cacheEntry.__typename === 'Link' ||
                    cacheEntry.__typename === 'Text') &&
                  cacheEntry.tags!.some((tag) => tag.__ref === `Tag:${tagId}`)
              )
              .map(({ __typename, _id }) => toReference({ __typename, _id }));
          },
        },
      },
    },
    Query: {
      fields: {
        link(_, { args: { linkId }, toReference }) {
          return toReference({
            __typename: 'Link',
            id: linkId,
          });
        },
        text(_, { args: { textId }, toReference }) {
          return toReference({
            __typename: 'Text',
            id: textId,
          });
        },
        tag(_, { args: { tagId }, toReference }) {
          return toReference({
            __typename: 'Tag',
            id: tagId,
          });
        },
      },
    },
  },
});

export const cachePersistor = new CachePersistor({
  cache,
  storage: new LocalForageWrapper(localforage),
  maxSize: false,
});

const apolloOptions = {
  link: new HttpLink({
    uri: `${backendUrl}/graphql`,
    credentials: 'include',
  }),
  // eslint-disable-next-line no-underscore-dangle
  cache: cache.restore(window.__APOLLO_CLIENT__),
  ssrMode: false,
  connectToDevTools: true,
};
export const apolloClient = new ApolloClient({
  ...apolloOptions,
});

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  setLogVerbosity('debug');
}

export const getApolloClient = async () => {
  await cachePersistor.restore();
  return apolloClient;
};
