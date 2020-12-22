import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

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
