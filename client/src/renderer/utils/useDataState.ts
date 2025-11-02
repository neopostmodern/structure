import { ErrorLike, NetworkStatus } from '@apollo/client'
import type { useLazyQuery, useQuery } from '@apollo/client/react'
import pick from 'lodash/pick'
import { useMemo } from 'react'

export enum DataState {
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  DATA = 'DATA',
  UNCALLED = 'UNCALLED',
}

export const OFFLINE_CACHE_MISS = 'OFFLINE_CACHE_MISS'

type OmittedAdditionalFieldNames = 'loading' | 'data' | 'error' | 'called'
const selectedAdditionalFieldNames = ['networkStatus', 'refetch'] as const
type SelectedAdditionalFieldNames =
  (typeof selectedAdditionalFieldNames)[number]
export type SelectedApolloQueryResultFields<QueryData, QueryVariables> = Pick<
  useQuery.Result<QueryData, QueryVariables>,
  SelectedAdditionalFieldNames
>

export type PolicedData<QueryData> =
  | { state: DataState.LOADING }
  | { state: DataState.DATA; data: QueryData; loadingBackground: boolean }
  | { state: DataState.ERROR; error: ErrorLike }

export type LazyPolicedData<QueryData> =
  | PolicedData<QueryData>
  | { state: DataState.UNCALLED }

const isQueryTuple = <QueryData, QueryVariables>(
  queryReturnValue:
    | useQuery.Result<QueryData, QueryVariables>
    | useLazyQuery.ResultTuple<QueryData, QueryVariables>,
): queryReturnValue is useLazyQuery.ResultTuple<QueryData, QueryVariables> =>
  Array.isArray(queryReturnValue)

export type UseDataStateResult<
  QueryData,
  QueryVariables,
  ApolloQueryDataOverride = void,
> = PolicedData<QueryData> &
  SelectedApolloQueryResultFields<
    ApolloQueryDataOverride extends void ? QueryData : ApolloQueryDataOverride,
    QueryVariables
  >
export type UseDataStateLazyQuery<
  QueryData,
  QueryVariables,
  ApolloQueryDataOverride = void,
> = LazyPolicedData<QueryData> &
  SelectedApolloQueryResultFields<
    ApolloQueryDataOverride extends void ? QueryData : ApolloQueryDataOverride,
    QueryVariables
  >
export type UseDataStateLazyResult<
  QueryData,
  QueryVariables,
  ApolloQueryDataOverride = void,
> = [
  useLazyQuery.ResultTuple<QueryData, QueryVariables>[0],
  UseDataStateLazyQuery<
    ApolloQueryDataOverride extends void ? QueryData : ApolloQueryDataOverride,
    QueryVariables
  >,
]

function useDataState<QueryData, QueryVariables>(
  queryTuple: useLazyQuery.ResultTuple<QueryData, QueryVariables>,
): UseDataStateLazyResult<QueryData, QueryVariables>
function useDataState<QueryData, QueryVariables>(
  queryResult: useQuery.Result<QueryData, QueryVariables>,
): UseDataStateResult<QueryData, QueryVariables>
function useDataState<QueryData, QueryVariables>(
  queryReturnValue:
    | useQuery.Result<QueryData, QueryVariables>
    | useLazyQuery.ResultTuple<QueryData, QueryVariables>,
):
  | UseDataStateResult<QueryData, QueryVariables>
  | UseDataStateLazyResult<QueryData, QueryVariables> {
  return useMemo(() => {
    let queryResult: useQuery.Result<QueryData, QueryVariables>
    let callQuery:
      | useLazyQuery.ResultTuple<QueryData, QueryVariables>[0]
      | undefined
    if (isQueryTuple(queryReturnValue)) {
      callQuery = queryReturnValue[0]
      queryResult = queryReturnValue[1]
    } else {
      queryResult = queryReturnValue
    }
    const { loading, data, error, called, ...additionalQueryFields } =
      queryResult
    const selectedAdditionalQueryFields = pick<
      Omit<
        useQuery.Result<QueryData, QueryVariables>,
        OmittedAdditionalFieldNames
      >,
      SelectedAdditionalFieldNames
    >(additionalQueryFields, selectedAdditionalFieldNames)
    if (callQuery !== undefined && !called) {
      return [
        callQuery,
        { state: DataState.UNCALLED, ...selectedAdditionalQueryFields },
      ]
    }
    let dataState: PolicedData<QueryData>
    if (data) {
      dataState = {
        state: DataState.DATA,
        data,
        loadingBackground:
          loading ||
          additionalQueryFields.networkStatus === NetworkStatus.refetch,
      }
    } else if (loading) {
      dataState = { state: DataState.LOADING }
    } else if (error) {
      dataState = { state: DataState.ERROR, error }
    } else if (queryResult.observable.options.fetchPolicy === 'cache-only') {
      // see https://github.com/apollographql/apollo-client/issues/7505 (cache-only queries throw no errors when they can't be fulfilled)
      dataState = {
        state: DataState.ERROR,
        error: new Error('Requested data not in cache', {
          cause: OFFLINE_CACHE_MISS,
        }),
      }
    } else {
      throw Error('[useDataState] Illegal state: no data')
    }

    let dataStateWithAdditionalFields = {
      ...dataState,
      ...selectedAdditionalQueryFields,
    }
    return callQuery
      ? [callQuery, dataStateWithAdditionalFields]
      : dataStateWithAdditionalFields
  }, [queryReturnValue])
}

export default useDataState
