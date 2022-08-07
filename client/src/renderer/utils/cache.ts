import apolloClient, { cachePersistor } from '../apollo';

export const clearApolloCache = () => {
  apolloClient.clearStore();
  cachePersistor.purge();
};
