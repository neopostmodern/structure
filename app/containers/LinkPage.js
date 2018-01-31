// @flow
import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withAddTagMutation, withRemoveTagMutation } from '../wrappers/tags';
import Tags from '../components/Tags';
import LinkForm from '../components/LinkForm';
import { clearMetadata, requestMetadata } from '../actions/userInterface';
import type { LinkType } from '../types';


export class LinkPage extends React.Component {
  props: {
    link: LinkType,
    requestMetadata: (url: string) => void,
    clearMetadata: () => void
  }

  componentDidMount() {
    if (this.props.link) {
      this.props.requestMetadata(this.props.link.url);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.link) {
      if (nextProps.link && this.props.link.url !== nextProps.link.url) {
        this.props.requestMetadata(nextProps.link.url);
      }
    } else if (nextProps.link && nextProps.link.url) {
      this.props.requestMetadata(nextProps.link.url);
    }
  }

  componentWillUnmount() {
    this.props.clearMetadata();
  }

  deleteLink = () => {
    this.props.deleteLink(this.props.link._id)
      .then((result) => {
        this.props.history.push('/');
        return result;
      });
  };

  handleLinkChange = (data) => {
    this.props.requestMetadata(data.url);
    this.props.updateLink(data);
  }

  render() {
    const { loading, link } = this.props;
    if (loading) {
      return <i>Loading...</i>;
    }
    //    form={link._id}
    return (<div style={{ marginTop: 50 }}>

      <LinkForm
        initialValues={link}
        metadata={this.props.metadata}
        onSubmit={this.props.updateLink}
        onChange={this.handleLinkChange}
      />
      <div style={{ marginTop: 30 }}>
        <Tags
          tags={link.tags}
          withShortcuts
          onAddTag={this.props.addTagByNameToNote.bind(this, link._id)}
          onRemoveTag={this.props.removeTagByIdFromNote.bind(null, link._id)}
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

const LINK_QUERY = gql`
  query Link($linkId: ID) {
    link(linkId: $linkId) {
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

const withData = graphql(LINK_QUERY, {
  options: ({ match }) => ({
    fetchPolicy: 'cache-and-network',
    variables: { linkId: match.params.linkId }
  }),
  props: ({ data: { loading, link, refetch } }) => ({
    loading,
    link,
    refetch
  }),
});
const withUpdateLink = graphql(UPDATE_LINK_MUTATION, {
  props: ({ mutate }) => ({
    updateLink: ({ _id, url, domain, path, name, description }) =>
      mutate({ variables: { link: { _id, url, domain, path, name, description } } })
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
  withDeleteLink,
  connect(
    ({ userInterface: { metadata } }) => ({ metadata }),
    (dispatch) => bindActionCreators({ requestMetadata, clearMetadata }, dispatch)
  )
)(LinkPage);
