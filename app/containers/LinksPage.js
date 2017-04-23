// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { gql, graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import { withAddTagMutation, withRemoveTagMutation } from '../wrappers/tags';
import LinksList from '../components/LinksList';
import { changeLinkLayout, LinkLayouts, LinkLayoutType } from '../actions/userInterface';

import styles from './LinksPage.css';

export function layoutToName(layout: LinkLayoutType) {
  switch (layout) {
    case LinkLayouts.GRID_LAYOUT:
      return 'Grid layout';
    case LinkLayouts.LIST_LAYOUT:
      return 'List layout';
    default:
      console.error('Unkown layout', layout);
      return 'Unknown layout';
  }
}

export class LinksPage extends React.Component {
  props: {
    loading: boolean,
    links?: Array<{ _id: string, url: string, createdAt: number }>,
    layout: LinkLayoutType,

    addTagByNameToLink: (linkId: string, tag: string) => void,
    changeLayout: (layout: LinkLayoutType) => void
  };

  toggleLayout = () => {
    if (this.props.layout === LinkLayouts.LIST_LAYOUT) {
      this.props.changeLayout(LinkLayouts.GRID_LAYOUT);
    } else {
      this.props.changeLayout(LinkLayouts.LIST_LAYOUT);
    }
  };

  render() {
    let content;
    if (!this.props.loading) {
      if (this.props.layout === LinkLayouts.LIST_LAYOUT) {
        content = (
          <LinksList
            links={this.props.links}
            addTagToLink={this.props.addTagByNameToLink}
            onRemoveTagFromLink={this.props.removeTagByIdFromLink}
          />
        );
      } else {
        content = <i>Unsupported layout</i>;
      }
    } else {
      content = <i>Loading...</i>;
    }
    return (
      <div>
        <div className={styles.menu}>
          <Link to="/links/add">Add new</Link>
          <a onClick={this.toggleLayout} style={{ marginLeft: 'auto' }}>
            {layoutToName(this.props.layout)}
          </a>
        </div>
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    layout: state.userInterface.linkLayout
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeLayout: changeLinkLayout }, dispatch);
}

const PROFILE_QUERY = gql`
  query LinksForList {
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
`;
const withData = graphql(PROFILE_QUERY, {
  options: {
    fetchPolicy: 'cache-and-network',
  },
  props: ({ data: { loading, links, refetch } }) => ({
    loading,
    links,
    refetch
  }),
});

export default compose(
  withData,
  withAddTagMutation,
  withRemoveTagMutation,
  connect(mapStateToProps, mapDispatchToProps)
)(LinksPage);
