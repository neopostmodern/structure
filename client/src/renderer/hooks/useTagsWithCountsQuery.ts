import { useEffect, useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';

import { BASE_TAG_FRAGMENT } from '../utils/sharedQueriesAndFragments';
import useDataState, {
  DataState,
  LazyPolicedData,
  OFFLINE_CACHE_MISS,
} from '../utils/useDataState';
import type { TagsWithCountsQuery } from '../generated/graphql';

const LAST_TAG_COUNTS_FETCH_KEY = 'lastTagCountsFetch';

export const TAGS_WITH_COUNTS_QUERY = gql`
  query TagsWithCounts {
    tags {
      ...BaseTag
      noteCount
    }
  }
  ${BASE_TAG_FRAGMENT}
`;

export const TAG_COUNTS_QUERY = gql`
  query TagCounts {
    tags {
      _id
      noteCount
    }
  }
`;

const useTagsWithCountsQuery = () => {
  const [isFetchingCounts, setIsFetchingCounts] = useState(false);
  const [fetchTagsQuery, tagsQuery] = useDataState(
    useLazyQuery<TagsWithCountsQuery>(TAGS_WITH_COUNTS_QUERY, {
      fetchPolicy: 'cache-only',
    })
  );
  const [fetchTagCountsQuery, tagCountsQuery] = useDataState(
    useLazyQuery<TagsWithCountsQuery>(TAG_COUNTS_QUERY, {
      fetchPolicy: 'network-only',
      onCompleted: () => {
        localStorage.setItem(
          LAST_TAG_COUNTS_FETCH_KEY,
          JSON.stringify(new Date().getTime())
        );
      },
    })
  );
  useEffect(() => {
    setTimeout(fetchTagsQuery, 0);
  }, [fetchTagsQuery]);

  useEffect(() => {
    if (tagCountsQuery.state !== DataState.UNCALLED) {
      return;
    }

    const lastFetched =
      JSON.parse(localStorage.getItem(LAST_TAG_COUNTS_FETCH_KEY)!) || 0;
    if (new Date().getTime() - lastFetched > 24 * 60 * 60 * 1000) {
      setIsFetchingCounts(true);
      fetchTagCountsQuery();
    }
  }, [tagCountsQuery, fetchTagCountsQuery, setIsFetchingCounts]);

  useEffect(() => {
    if (
      isFetchingCounts &&
      tagCountsQuery.state !== DataState.LOADING &&
      !(
        tagsQuery.state === DataState.ERROR &&
        tagsQuery.error.extraInfo === OFFLINE_CACHE_MISS
      )
    ) {
      setIsFetchingCounts(false);
    }
  }, [isFetchingCounts, setIsFetchingCounts, tagCountsQuery, tagsQuery]);

  if (isFetchingCounts) {
    return { state: DataState.LOADING } as LazyPolicedData<TagsWithCountsQuery>;
  }

  return tagsQuery;
};

export default useTagsWithCountsQuery;
