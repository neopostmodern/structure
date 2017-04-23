import ApolloClient, { addTypename } from 'apollo-client';
import { PersistedQueryNetworkInterface } from 'persistgraphql';

import config from './config';

// import { SubscriptionClient } from 'subscriptions-transport-ws';

// import addGraphQLSubscriptions from './helpers/subscriptions';

const queryMap = null; // hack

function getNetworkInterface(host = '', headers = {}) {
  return new PersistedQueryNetworkInterface({
    queryMap,
    uri: `${host}/graphql`,
    opts: {
      credentials: 'include', // 'same-origin',
      headers,
    },
    enablePersistedQueries: config.persistedQueries,
  });
}

// webFrame.registerURLSchemeAsSecure('ws');
// const subscriptionsURL = 'ws://localhost:3001/subscriptions';
// const wsClient = new SubscriptionClient(subscriptionsURL, {
//   reconnect: true,
// });
// const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
//   getNetworkInterface('http://localhost:3001'), // 'http://localhost:3010/subscriptions'
//   wsClient,
// );
const apolloOptions = {
  networkInterface: getNetworkInterface(BACKEND_URL), // networkInterfaceWithSubscriptions,
  initialState: window.__APOLLO_STATE__, // eslint-disable-line no-underscore-dangle
  // ssrForceFetchDelay: 100,
  connectToDevTools: true,
  dataIdFromObject: o => o._id // eslint-disable-line no-underscore-dangle
};
const client = new ApolloClient(Object.assign({}, {
  queryTransformer: addTypename,
  dataIdFromObject: (result) => {
    if (result.id && result.__typename) { // eslint-disable-line no-underscore-dangle
      return result.__typename + result.id; // eslint-disable-line no-underscore-dangle
    }
    return null;
  },
  // shouldBatch: true,
}, apolloOptions));

export default client;
