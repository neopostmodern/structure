// @flow
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { gql, graphql, compose } from 'react-apollo';

import styles from './TagsPage.scss';
import menuStyles from '../styles/menu.scss';
import type { TagType } from '../types';

export class TagsPage extends React.Component {
  props: {
    loading: boolean,
    tags?: Array<TagType>
  };

  render() {
    let content;
    if (!this.props.loading) {
      content = (<React.Fragment>
        <div className={menuStyles.menu}>
          <a
            onClick={() => alert('This feature is not yet available')}
            className={menuStyles.disabled}
          >
            Chaos view
          </a>
        </div>
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
      </React.Fragment>);
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
