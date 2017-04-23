// @flow
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ConnectedRouter } from 'react-router-redux';
import Routes from '../routes';

type RootType = {
  store: {},
  history: {},
  client: {}
};

export default function Root({ store, history, client }: RootType) {
  return (
    <ApolloProvider store={store} client={client}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </ApolloProvider>
  );
}
