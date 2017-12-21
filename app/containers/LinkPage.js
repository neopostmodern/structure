// @flow
import React from 'react';
import { gql, graphql, compose } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withAddTagMutation, withRemoveTagMutation } from '../wrappers/tags';
import Tags from '../components/Tags';
import LinkForm from '../components/LinkForm';
import { clearMetadata, requestMetadata } from '../actions/userInterface';
import type { LinkType } from '../types';
import Centered from '../components/Centered';


export class LinkPage extends React.Component {
  props: {
    link: LinkType,
    requestMetadata: (url: string) => void,
    clearMetadata: () => void,
    scrapeLink: (linkId: string) => void
  }

  longPollInterval = null;

  startLongPoll() {
    this.longPollInterval = setInterval(() => this.props.refetch(), 5000);
  }
  stopLongPoll() {
    clearInterval(this.longPollInterval);
  }

  componentDidMount() {
    if (this.props.link) {
      this.props.requestMetadata(this.props.link.url);

      if (this.props.link.scrapedAt === 0) {
        this.startLongPoll();
      } else {
        this.stopLongPoll();
      }
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

    if (nextProps.link) {
      if (nextProps.link.scrapedAt === 0) {
        this.startLongPoll();
      } else {
        this.stopLongPoll();
      }
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
    if (loading && !link) { // optimistically show data if something is on hold
      console.log("Data while loading", link);
      return <Centered>Loading...</Centered>;
    }

    return (<div style={{ marginTop: 50 }}>
      { loading
        ? <div style={{ backgroundColor: '#eee', padding: '0.5rem', textAlign: 'center', marginBottom: '1rem' }}>
          Refreshing...
        </div>
        : null}
      <LinkForm
        initialValues={link}
        metadata={this.props.metadata}
        onSubmit={this.props.updateLink}
        onChange={this.handleLinkChange}
        onRequestScrape={this.props.scrapeLink}
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
      scrapedAt
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
      scrapedAt
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
const SCRAPE_LINK_MUTATION = gql`
  mutation scrapeLink($linkId: ID!){
    scrapeLink(linkId: $linkId) {
      _id
      createdAt
      scrapedAt
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
const withScrapeLink = graphql(SCRAPE_LINK_MUTATION, {
  props: ({ mutate }) => ({
    scrapeLink: (_id) => mutate({ variables: { linkId: _id } })
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
  withScrapeLink,
  withDeleteLink,
  connect(
    ({ userInterface: { metadata } }) => ({ metadata }),
    (dispatch) => bindActionCreators({ requestMetadata, clearMetadata }, dispatch)
  )
)(LinkPage);
