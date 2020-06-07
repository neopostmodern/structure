import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

// import { SubscriptionClient } from 'subscriptions-transport-ws';

// import addGraphQLSubscriptions from './helpers/subscriptions';

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

// webFrame.registerURLSchemeAsSecure('ws');
// const subscriptionsURL = 'ws://localhost:3001/subscriptions';
// const wsClient = new SubscriptionClient(subscriptionsURL, {
//   reconnect: true,
// });
// const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
//   getNetworkInterface('http://localhost:3001'), // 'http://localhost:3010/subscriptions'
//   wsClient,
// );
// todo: investigate 'dataIdFromObject'
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
  // shouldBatch: true,
  ...apolloOptions,
})

export default client
