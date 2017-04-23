import React from 'react';
import { gql, withApollo, ApolloClient } from 'react-apollo';
import { Link } from 'react-router-dom';
import { filter, propType } from 'graphql-anywhere';

import RepoInfo from './RepoInfo';
import COMMENT_QUERY from '../graphql/Comment.graphql';

const FeedEntry = ({
  loggedIn,
  onVote,
  entry,
  client,
}) => {
  const {
    commentCount,
    repository: {
      full_name,
      html_url,
      owner: {
        avatar_url,
      },
    },
  } = entry;

  const repoLink = `/${full_name}`;
  const prefetchComments = repoFullName => () => {
    client.query({
      query: COMMENT_QUERY,
      variables: { repoName: repoFullName },
    });
  };

  return (
    <div style={{marginBottom: '1rem'}}>
      <div className="media-body">
        <div>
          {full_name}<br/>
          <a href={html_url}>{html_url}</a>
        </div>
        <RepoInfo entry={filter(RepoInfo.fragments.entry, entry)} >
          <Link to={repoLink} onMouseOver={prefetchComments(entry.repository.full_name)}>
            View comments ({commentCount})
          </Link>
        </RepoInfo>
      </div>
    </div>
  );
};

FeedEntry.fragments = {
  entry: gql`
    fragment FeedEntry on Entry {
      id
      commentCount
      repository {
        full_name
        html_url
        owner {
          avatar_url
        }
      }
      ...RepoInfo
    }
    ${RepoInfo.fragments.entry}
  `,
};

FeedEntry.propTypes = {
  loggedIn: React.PropTypes.bool.isRequired,
  onVote: React.PropTypes.func.isRequired,
  entry: propType(FeedEntry.fragments.entry).isRequired,
  client: React.PropTypes.instanceOf(ApolloClient).isRequired,
};

export default withApollo(FeedEntry);
