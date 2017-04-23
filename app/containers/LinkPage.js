// @flow
import React from 'react';
import { gql, graphql, compose } from 'react-apollo';
import { Field, reduxForm } from 'redux-form';

import { withAddTagMutation, withRemoveTagMutation } from '../wrappers/tags';
import Tags from '../components/Tags';

import formStyles from './LinkForm.css';

export class InternalLinkForm extends React.Component {
  render() {
    return (<form onSubmit={this.props.handleSubmit} className={formStyles.form}>
      <Field
        name="url"
        component="input"
        type="text"
        className={formStyles.url}
      />
      <Field
        name="name"
        component="input"
        type="text"
        className={formStyles.name}
      />
      <Field
        name="description"
        component="textarea"
        className={formStyles.description}
      />
    </form>);
  }
}

export const LinkForm = reduxForm()(InternalLinkForm);

export class LinkPage extends React.Component {
  deleteLink = () => {
    this.props.deleteLink(this.props.link._id)
      .then((result) => {
        this.props.history.push('/');
        return result;
      });
  };

  render() {
    const { loading, link } = this.props;
    if (loading) {
      return <i>Loading...</i>;
    }
    return (<div style={{ marginTop: 50 }}>
      <LinkForm
        form={link._id}
        initialValues={link}
        onSubmit={this.props.updateLink}
        onChange={this.props.updateLink}
      />
      <div style={{ marginTop: 30 }}>
        <Tags
          tags={link.tags}
          onAddTag={this.props.addTagByNameToLink.bind(this, link._id)}
          onRemoveTag={this.props.removeTagByIdFromLink.bind(null, link._id)}
        />
      </div>
      <div style={{ display: 'flex', marginTop: 50 }}>
        <button type="button" style={{ marginLeft: 'auto' }} onClick={this.deleteLink}>
          Delete
        </button>
      </div>
    </div>);
  }
}

const PROFILE_QUERY = gql`
  query LinksForList {
    links {
      _id
      createdAt
      url
      name
      description
      domain
      tags {
        _id
        name
        color
      }
    }
  }
`;

const UPDATE_LINK_MUTATION = gql`
  mutation updateLink($link: InputLink!){
    updateLink(link: $link) {
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
`;
const DELETE_LINK_MUTATION = gql`
  mutation deleteLink($linkId: ID!){
    deleteLink(linkId: $linkId) {
      _id
    }
  }
`;

const withData = graphql(PROFILE_QUERY, {
  options: {
    fetchPolicy: 'cache-and-network',
  },
  props: ({ data: { loading, links, refetch }, ownProps: { match } }) => ({
    loading,
    link: links && links.find((link) => link._id === match.params.linkId),
    refetch
  }),
});
const withUpdateLink = graphql(UPDATE_LINK_MUTATION, {
  props: ({ mutate }) => ({
    updateLink: ({ _id, url, domain, path, name, description }) => mutate({ variables: { link: { _id, url, domain, path, name, description } } })
  })
});
const withDeleteLink = graphql(DELETE_LINK_MUTATION, {
  props: ({ mutate }) => ({
    deleteLink: (_id) => mutate({ variables: { linkId: _id } })
  })
});
export default compose(
  withData,
  withAddTagMutation,
  withRemoveTagMutation,
  withUpdateLink,
  withDeleteLink
)(LinkPage);
