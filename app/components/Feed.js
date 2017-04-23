import React from 'react';
import { propType } from 'graphql-anywhere';

import FeedEntry from './FeedEntry';

const Feed = ({ entries = [], loggedIn, onVote, onLoadMore }) => {
  if (entries && entries.length) {
    return (
      <div> {
        entries.map(entry => (
          entry ? <FeedEntry
            key={entry.repository.full_name}
            entry={entry}
            loggedIn={loggedIn}
            onVote={onVote}
          /> : null
        ))
      }
        <button onClick={onLoadMore}>Load more</button>
      </div>
    );
  }
  return <div />;
};

Feed.propTypes = {
  entries: React.PropTypes.arrayOf(propType(FeedEntry.fragments.entry).isRequired),
  loggedIn: React.PropTypes.bool.isRequired,
  onVote: React.PropTypes.func.isRequired,
  onLoadMore: React.PropTypes.func.isRequired,
};

export default Feed;
