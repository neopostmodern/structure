import ApolloClient, { addTypename } from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';

// import { SubscriptionClient } from 'subscriptions-transport-ws';

// import addGraphQLSubscriptions from './helpers/subscriptions';

const link = createHttpLink({
  uri: `${BACKEND_URL}/graphql`,
  credentials: 'include'
});

const cache = new InMemoryCache({
  dataIdFromObject: o => o._id, // eslint-disable-line no-underscore-dangle
  addTypename: true,
  cacheResolvers: {},
  fragmentMatcher: new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
      __schema: {
        types: [
          {
            kind: 'INTERFACE',
            name: 'INote',
            possibleTypes: [
              {
                name: 'Link'
              },
              {
                name: 'Text'
              }
            ]
          },
          {
            kind: 'UNION',
            name: 'Note',
            possibleTypes: [
              {
                name: 'Link'
              },
              {
                name: 'Text'
              }
            ]
          },
        ],
      },
    }
  }),
});

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
  link,
  cache: cache.restore(window.__APOLLO_CLIENT__),
  ssrMode: false,
  connectToDevTools: true
};
const client = new ApolloClient(Object.assign({}, {
  queryTransformer: addTypename,
  // shouldBatch: true,
}, apolloOptions));

export default client;
