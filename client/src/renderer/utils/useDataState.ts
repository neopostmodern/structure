import { ApolloError, QueryResult, QueryTuple } from '@apollo/client';
import { pick } from 'lodash';

export enum DataState {
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  DATA = 'DATA',
  UNCALLED = 'UNCALLED',
}

type OmittedAdditionalFieldNames = 'loading' | 'data' | 'error' | 'called';
const selectedAdditionalFieldNames = ['networkStatus', 'refetch'] as const;
type SelectedAdditionalFieldNames = typeof selectedAdditionalFieldNames[number];
type SelectedApolloQueryResultFields<QueryData, QueryVariables> = Pick<
  QueryResult<QueryData, QueryVariables>,
  SelectedAdditionalFieldNames
>;

type PolicedData<QueryData> =
  | { state: DataState.LOADING }
  | { state: DataState.DATA; data: QueryData; loadingBackground: boolean }
  | { state: DataState.ERROR; error: ApolloError };

type LazyPolicedData<QueryData> =
  | PolicedData<QueryData>
  | { state: DataState.UNCALLED };

const isQueryTuple = <QueryData, QueryVariables>(
  queryReturnValue:
    | QueryResult<QueryData, QueryVariables>
    | QueryTuple<QueryData, QueryVariables>
): queryReturnValue is QueryTuple<QueryData, QueryVariables> =>
  Array.isArray(queryReturnValue);

function useDataState<QueryData, QueryVariables>(
  queryTuple: QueryTuple<QueryData, QueryVariables>
): [
  QueryTuple<QueryData, QueryVariables>[0],
  LazyPolicedData<QueryData> &
    SelectedApolloQueryResultFields<QueryData, QueryVariables>
];
function useDataState<QueryData, QueryVariables>(
  queryResult: QueryResult<QueryData, QueryVariables>
): PolicedData<QueryData> &
  SelectedApolloQueryResultFields<QueryData, QueryVariables>;
function useDataState<QueryData, QueryVariables>(
  queryReturnValue:
    | QueryResult<QueryData, QueryVariables>
    | QueryTuple<QueryData, QueryVariables>
):
  | (PolicedData<QueryData> &
      SelectedApolloQueryResultFields<QueryData, QueryVariables>)
  | [
      QueryTuple<QueryData, QueryVariables>[0],
      LazyPolicedData<QueryData> &
        SelectedApolloQueryResultFields<QueryData, QueryVariables>
    ] {
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
  if (error) {
    dataState = { state: DataState.ERROR, error };
  } else if (data) {
    dataState = { state: DataState.DATA, data, loadingBackground: loading };
  } else if (queryResult.loading) {
    dataState = { state: DataState.LOADING };
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
}

export default useDataState;
