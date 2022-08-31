import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { CachePersistor, LocalStorageWrapper } from 'apollo3-cache-persist';

let backendUrl;
if (process.env.TARGET === 'web') {
  // no backend customization for web, other backends should host their own frontends
  backendUrl = BACKEND_URL;
} else {
  backendUrl = window.electron.electronStore.get('backend-url', BACKEND_URL);

  if (backendUrl.endsWith('structure.neopostmodern.com')) {
    window.electron.electronStore.set('backend-url', BACKEND_URL);
    backendUrl = BACKEND_URL;
  }
}

const cache = new InMemoryCache({
  possibleTypes: {
    INote: ['Link', 'Text'],
  },
  typePolicies: {
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
      },
    },
  },
});

export const cachePersistor = new CachePersistor({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
  maxSize: false,
});
// todo: await before instantiating ApolloClient, else queries might run before the cache is persisted
cachePersistor.restore();

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
const client = new ApolloClient({
  ...apolloOptions,
});

export default client;
