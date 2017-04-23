import React from 'react';
import { graphql } from 'react-apollo';

import Feed from '../components/Feed';

import FEED_QUERY from '../graphql/FeedQuery.graphql';
import VOTE_MUTATION from '../graphql/Vote.graphql';

class FeedPage extends React.Component {
  constructor() {
    super();
    this.offset = 0;
  }
  
  render() {
    const { vote, loading, currentUser, feed, fetchMore } = this.props;
    
    return (
      <div>
        <Feed
          entries={feed || []}
          loggedIn={!!currentUser}
          onVote={vote}
          onLoadMore={fetchMore}
        />
        {loading ? <i>Loading...</i> : null}
      </div>
    );
  }
}

FeedPage.propTypes = {
  loading: React.PropTypes.bool.isRequired,
  currentUser: React.PropTypes.shape({
    login: React.PropTypes.string.isRequired,
  }),
  feed: Feed.propTypes.entries,
  fetchMore: React.PropTypes.func,
  vote: React.PropTypes.func.isRequired,
};

const ITEMS_PER_PAGE = 10;
const withData = graphql(FEED_QUERY, {
  options: props => ({
    variables: {
      type: (
        props.params &&
        props.params.type &&
        props.params.type.toUpperCase()
      ) || 'TOP',
      offset: 0,
      limit: ITEMS_PER_PAGE,
    },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data: { loading, feed, currentUser, fetchMore } }) => ({
    loading,
    feed,
    currentUser,
    fetchMore: () => fetchMore({
      variables: {
        offset: feed.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult.data) { return prev; }
        return Object.assign({}, prev, {
          feed: [...prev.feed, ...fetchMoreResult.data.feed],
        });
      },
    }),
  }),
});

const withMutations = graphql(VOTE_MUTATION, {
  props: ({ mutate }) => ({
    vote: ({ repoFullName, type }) => mutate({
      variables: { repoFullName, type },
    }),
  }),
});

export default withMutations(withData(FeedPage));
