import React from 'react';
import TimeAgo from 'react-timeago';
import { emojify } from 'node-emoji';
import { gql } from 'react-apollo';
import { propType } from 'graphql-anywhere';

const RepoInfo = ({
  entry: {
    createdAt,
    repository: {
      description,
      stargazers_count,
      open_issues_count,
    },
    postedBy: {
      html_url,
      login,
    },
  },
  children,
}) => (
  <div>
    <small>
      Submitted&nbsp;
      <TimeAgo
        date={createdAt}
      />
      &nbsp;by&nbsp;
      <a href={html_url}>{login}</a>
    </small>
    <div>
      {description && emojify(description)}
    </div>
    <div>
      Stars {stargazers_count}
      &nbsp;/&nbsp;
      Issues {open_issues_count}
      &nbsp;/&nbsp;
      {children}
    </div>
  </div>
);

RepoInfo.fragments = {
  entry: gql`
    fragment RepoInfo on Entry {
      createdAt
      repository {
        description
        stargazers_count
        open_issues_count
      }
      postedBy {
         html_url
         login
      }
    }
  `,
};

RepoInfo.propTypes = {
  entry: propType(RepoInfo.fragments.entry).isRequired,
  children: React.PropTypes.node,
};

export default RepoInfo;
