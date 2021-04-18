import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { LocalStorageWrapper, persistCache } from 'apollo3-cache-persist'

let backendUrl
if (process.env.TARGET === 'web') {
  // no backend customization for web, other backends should host their own frontends
  backendUrl = BACKEND_URL
} else {
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  const ElectronStore = require('electron-store')
  const electronStore = new ElectronStore()
  backendUrl = electronStore.get('backend-url', BACKEND_URL)
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
          })
        },
        text(_, { args: { textId }, toReference }) {
          return toReference({
            __typename: 'Text',
            id: textId,
          })
        },
      },
    },
  },
})

// await before instantiating ApolloClient, else queries might run before the cache is persisted
await persistCache({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
  maxSize: false,
})

const apolloOptions = {
  link: new HttpLink({
    uri: `${backendUrl}/graphql`,
    credentials: 'include',
  }),
  // eslint-disable-next-line no-underscore-dangle
  cache: cache.restore(window.__APOLLO_CLIENT__),
  ssrMode: false,
  connectToDevTools: true,
}
const client = new ApolloClient({
  ...apolloOptions,
})

export default client
