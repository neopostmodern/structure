import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  setLogVerbosity,
} from '@apollo/client';
import { CachePersistor, LocalForageWrapper } from 'apollo3-cache-persist';
import localforage from 'localforage';

let backendUrl;
if (__BUILD_TARGET__ === 'web') {
  // no backend customization for web, other backends should host their own frontends
  backendUrl = __BACKEND_URL__;
} else {
  backendUrl = localStorage.getItem('backend-url') || __BACKEND_URL__;

  if (backendUrl.endsWith('structure.neopostmodern.com')) {
    localStorage.setItem('backend-url', __BACKEND_URL__);
    backendUrl = __BACKEND_URL__;
  }
}

const notesWithTagHelper = (
  cacheData: {
    [key: string]: {
      __typename: string;
      _id: string;
      tags?: Array<{ __ref: string }>;
    };
  },
  tagId: string
) =>
  Object.values(cacheData).filter(
    (cacheEntry) =>
      (cacheEntry.__typename === 'Link' || cacheEntry.__typename === 'Text') &&
      cacheEntry.tags!.some((tag) => tag.__ref === `Tag:${tagId}`)
  );

const cache = new InMemoryCache({
  possibleTypes: {
    INote: ['Link', 'Text'],
  },
  typePolicies: {
    Tag: {
      fields: {
        notes: {
          read(currentValue, { variables: { tagId }, toReference }) {
            if (currentValue) {
              return currentValue;
            }
            return notesWithTagHelper(cache.data.data, tagId).map(
              ({ __typename, _id }) => toReference({ __typename, _id })
            );
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

if (import.meta.env.DEV || __DEBUG_PROD__ === 'true') {
  setLogVerbosity('debug');
}

export const getApolloClient = async () => {
  await cachePersistor.restore();
  return apolloClient;
};
