import { DataState, UseDataStateResult } from '../utils/useDataState';

// todo: only store cache references and then hydrate from the cache to maintain object references?
const useOptimisticCache = <
  QueryData,
  QueryVariables,
  ApolloQueryDataOverride = void
>(
  query: UseDataStateResult<QueryData, QueryVariables, ApolloQueryDataOverride>,
  cacheKey: string,
  cacheHydration: (data: QueryData) => QueryData
): UseDataStateResult<QueryData, QueryVariables, ApolloQueryDataOverride> & {
  optimistic?: boolean;
} => {
  if (query.state === DataState.LOADING) {
    const cacheRetrievedData = JSON.parse(
      localStorage.getItem(cacheKey) || 'null'
    );

    if (cacheRetrievedData) {
      return {
        ...query,
        state: DataState.DATA,
        data: cacheRetrievedData,
        loadingBackground: true,
        optimistic: true,
      };
    }
  }

  if (query.state === DataState.DATA) {
    const dataToCache = cacheHydration(query.data);
    localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
  }

  return query;
};

export default useOptimisticCache;
