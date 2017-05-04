// @flow
import * as React from 'react';
import { gql, graphql, compose } from 'react-apollo';

import styles from './TagPage.scss';
import type { TagType } from '../types';
import LinksList from '../components/LinksList';
import { withAddTagMutation, withRemoveTagMutation } from '../wrappers/tags';

import TagForm from '../components/TagForm';

type TagActions = {
  addTagByNameToLink: (linkId: string, tagName: string) => void,
  removeTagByIdFromLink: (linkId: string, tagId: string) => void
};
type TagPropsLoading = { loading: true };
type TagProps = { loading: false, tag: TagType };

class TagPage extends React.Component {
  // todo: breaks flow runtime
  // props: TagPropsLoading | TagProps & TagActions;

  render() {
    let content;
    if (!this.props.loading) {
      content = (<div className={styles.container}>
        <TagForm
          initialValues={this.props.tag}
          form={this.props.tag._id}
          onSubmit={this.props.updateTag}
          onChange={this.props.updateTag}
        />

        <LinksList
          links={this.props.tag.links}
          addTagToLink={this.props.addTagByNameToLink}
          onRemoveTagFromLink={this.props.removeTagByIdFromLink}
        />
      </div>);
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
const UPDATE_TAG_MUTATION = gql`
  mutation UpdateTag($tag: InputTag!) {
    updateTag(tag: $tag) {
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
const withUpdateTag = graphql(UPDATE_TAG_MUTATION, {
  props: ({ mutate }) => ({
    updateTag: ({ _id, name, color }) => mutate({ variables: { tag: { _id, name, color } } })
  })
});

export default compose(
  withData,
  withAddTagMutation,
  withRemoveTagMutation,
  withUpdateTag
)(TagPage);
