// @flow
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import Routes from '../routes';

type RootType = {
  store: {},
  history: {},
  client: {}
};

export default function Root({ store, history, client }: RootType) {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </Provider>
    </ApolloProvider>
  );
}
