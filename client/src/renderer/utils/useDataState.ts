import {
  ApolloError,
  NetworkStatus,
  QueryResult,
  QueryTuple,
} from '@apollo/client';
import pick from 'lodash/pick';
import { useMemo } from 'react';

export enum DataState {
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  DATA = 'DATA',
  UNCALLED = 'UNCALLED',
}

export const OFFLINE_CACHE_MISS = 'OFFLINE_CACHE_MISS';

type OmittedAdditionalFieldNames = 'loading' | 'data' | 'error' | 'called';
const selectedAdditionalFieldNames = ['networkStatus', 'refetch'] as const;
type SelectedAdditionalFieldNames = typeof selectedAdditionalFieldNames[number];
export type SelectedApolloQueryResultFields<QueryData, QueryVariables> = Pick<
  QueryResult<QueryData, QueryVariables>,
  SelectedAdditionalFieldNames
>;

export type PolicedData<QueryData> =
  | { state: DataState.LOADING }
  | { state: DataState.DATA; data: QueryData; loadingBackground: boolean }
  | { state: DataState.ERROR; error: ApolloError };

export type LazyPolicedData<QueryData> =
  | PolicedData<QueryData>
  | { state: DataState.UNCALLED };

const isQueryTuple = <QueryData, QueryVariables>(
  queryReturnValue:
    | QueryResult<QueryData, QueryVariables>
    | QueryTuple<QueryData, QueryVariables>
): queryReturnValue is QueryTuple<QueryData, QueryVariables> =>
  Array.isArray(queryReturnValue);

export type UseDataStateResult<
  QueryData,
  QueryVariables,
  ApolloQueryDataOverride = void
> = PolicedData<QueryData> &
  SelectedApolloQueryResultFields<
    ApolloQueryDataOverride extends void ? QueryData : ApolloQueryDataOverride,
    QueryVariables
  >;
export type UseDataStateLazyQuery<
  QueryData,
  QueryVariables,
  ApolloQueryDataOverride = void
> = LazyPolicedData<QueryData> &
  SelectedApolloQueryResultFields<
    ApolloQueryDataOverride extends void ? QueryData : ApolloQueryDataOverride,
    QueryVariables
  >;
export type UseDataStateLazyResult<
  QueryData,
  QueryVariables,
  ApolloQueryDataOverride = void
> = [
  QueryTuple<QueryData, QueryVariables>[0],
  UseDataStateLazyQuery<
    ApolloQueryDataOverride extends void ? QueryData : ApolloQueryDataOverride,
    QueryVariables
  >
];

function useDataState<QueryData, QueryVariables>(
  queryTuple: QueryTuple<QueryData, QueryVariables>
): UseDataStateLazyResult<QueryData, QueryVariables>;
function useDataState<QueryData, QueryVariables>(
  queryResult: QueryResult<QueryData, QueryVariables>
): UseDataStateResult<QueryData, QueryVariables>;
function useDataState<QueryData, QueryVariables>(
  queryReturnValue:
    | QueryResult<QueryData, QueryVariables>
    | QueryTuple<QueryData, QueryVariables>
):
  | UseDataStateResult<QueryData, QueryVariables>
  | UseDataStateLazyResult<QueryData, QueryVariables> {
  return useMemo(() => {
    let queryResult: QueryResult<QueryData, QueryVariables>;
    let callQuery: QueryTuple<QueryData, QueryVariables>[0] | undefined;
    if (isQueryTuple(queryReturnValue)) {
      callQuery = queryReturnValue[0];
      queryResult = queryReturnValue[1];
    } else {
      queryResult = queryReturnValue;
    }
    const { loading, data, error, called, ...additionalQueryFields } =
      queryResult;
    const selectedAdditionalQueryFields = pick<
      Omit<QueryResult<QueryData, QueryVariables>, OmittedAdditionalFieldNames>,
      SelectedAdditionalFieldNames
    >(additionalQueryFields, selectedAdditionalFieldNames);
    if (callQuery !== undefined && !called) {
      return [
        callQuery,
        { state: DataState.UNCALLED, ...selectedAdditionalQueryFields },
      ];
    }
    let dataState: PolicedData<QueryData>;
    if (data) {
      dataState = {
        state: DataState.DATA,
        data,
        loadingBackground:
          loading ||
          additionalQueryFields.networkStatus === NetworkStatus.refetch,
      };
    } else if (loading) {
      dataState = { state: DataState.LOADING };
    } else if (error) {
      dataState = { state: DataState.ERROR, error };
    } else if (queryResult.observable.options.fetchPolicy === 'cache-only') {
      // see https://github.com/apollographql/apollo-client/issues/7505 (cache-only queries throw no errors when they can't be fulfilled)
      dataState = {
        state: DataState.ERROR,
        error: new ApolloError({
          errorMessage: 'Requested data not in cache',
          extraInfo: OFFLINE_CACHE_MISS,
        }),
      };
    } else {
      throw Error('[useDataState] Illegal state: no data');
    }

    let dataStateWithAdditionalFields = {
      ...dataState,
      ...selectedAdditionalQueryFields,
    };
    return callQuery
      ? [callQuery, dataStateWithAdditionalFields]
      : dataStateWithAdditionalFields;
  }, [queryReturnValue]);
}

export default useDataState;
