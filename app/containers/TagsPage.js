// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { gql, graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import styles from './TagsPage.scss';
import type { TagType } from '../types';

export class TagsPage extends React.Component {
  props: {
    loading: boolean,
    tags?: Array<TagType>
  };

  render() {
    let content;
    if (!this.props.loading) {
      content = (
        <div className={styles.tagContainer}>
          {this.props.tags.map((tag) => (
            <div
              key={tag._id}
              className={styles.tag}
              style={{ backgroundColor: tag.color }}
              onClick={() => this.props.history.push(`/tags/${tag._id}`)}
            >
              {tag.name}
            </div>
          ))}
        </div>
      );
    } else {
      content = <i>Loading...</i>;
    }
    return (
      <div>
        {content}
      </div>
    );
  }
}

const TAGS_QUERY = gql`
  query Tags {
    tags {
      _id
      name
      color
    }
  }
`;
const withData = graphql(TAGS_QUERY, {
  options: {
    fetchPolicy: 'cache-and-network',
  },
  props: ({ data: { loading, tags } }) => ({
    loading,
    tags
  }),
});

export default compose(
  withData
)(TagsPage);
