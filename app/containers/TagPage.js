// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { gql, graphql, compose } from 'react-apollo';

import styles from './TagPage.scss';
import type { TagType } from "../types";
import LinksList from "../components/LinksList";
import {withAddTagMutation, withRemoveTagMutation} from "../wrappers/tags";

export class TagPage extends React.Component {
  props: {
    loading: boolean,
    tag?: TagType
  };

  render() {
    let content;
    if (!this.props.loading) {
      content = <div className={styles.container}>
        <div className={styles.colorBlock} style={{ backgroundColor: this.props.tag.color }} />
        <h1>{this.props.tag.name}</h1>

        <LinksList
          links={this.props.tag.links}
          addTagToLink={this.props.addTagByNameToLink}
          onRemoveTagFromLink={this.props.removeTagByIdFromLink}
        />
      </div>;
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

const TAG_QUERY = gql`
  query Tag($tagId: ID!) {
    tag(tagId: $tagId) {
      _id
      name
      color
      
      links {
        _id
        createdAt
        url
        domain
        name
        description
        tags {
          _id
          name
          color
        }
      }
    }
  }
`;
const withData = graphql(TAG_QUERY, {
  options: ({ match }) => ({
    fetchPolicy: 'cache-and-network',
    variables: { tagId: match.params.tagId }
  }),
  props: ({ data: { loading, tag, refetch } }) => ({
    loading,
    tag,
    refetch
  }),
});

export default compose(
  withData,
  withAddTagMutation,
  withRemoveTagMutation
)(TagPage);
