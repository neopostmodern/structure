// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { gql, graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import { withAddTagMutation, withRemoveTagMutation } from '../wrappers/tags';
import NotesList from '../components/NotesList';
import {
  changeLinkLayout, changeSearchQuery, LinkLayouts,
  LinkLayoutType
} from '../actions/userInterface'

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

export class NotesPage extends React.Component {
  searchInput: HTMLInputElement;

  props: {
    loading: boolean,
    notes?: Array<{ _id: string, url: string, createdAt: number }>,
    layout: LinkLayoutType,
    searchQuery: string,

    addTagByNameToNote: (linkId: string, tag: string) => void,
    removeTagByIdFromNote: (linkId: string, tagId: string) => void,
    changeLayout: (layout: LinkLayoutType) => void,
    changeSearchQuery: (query: string) => void
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyboardEvent, true);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyboardEvent, true);
  }

  handleKeyboardEvent = (event: KeyboardEvent) => {
    if (event.ctrlKey) {
      // eslint-disable-next-line default-case
      switch (event.key) {
        case 'f':
          this.searchInput.focus();
          event.preventDefault();
          break;
      }
    }
  }

  toggleLayout = () => {
    if (this.props.layout === LinkLayouts.LIST_LAYOUT) {
      this.props.changeLayout(LinkLayouts.GRID_LAYOUT);
    } else {
      this.props.changeLayout(LinkLayouts.LIST_LAYOUT);
    }
  };

  handleSearchInputChange = () => {
    this.props.changeSearchQuery(this.searchInput.value);
  }

  filteredLinks() {
    if (this.props.searchQuery.length === 0) {
      return this.props.notes;
    }

    return this.props.notes.filter((note) =>
      (note.url && note.url.includes(this.props.searchQuery))
      || (note.name && note.name.includes(this.props.searchQuery))
      || note.tags.some((tag) => tag.name.includes(this.props.searchQuery))
    );
  }

  render() {
    let content;
    if (!this.props.loading) {
      if (this.props.layout === LinkLayouts.LIST_LAYOUT) {
        content = (
          <NotesList
            notes={this.filteredLinks()}
            addTagToNote={this.props.addTagByNameToNote}
            onRemoveTagFromNote={this.props.removeTagByIdFromNote}
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
          <Link to="/notes/add">Add new</Link>,&nbsp;
          <a onClick={this.toggleLayout}>
            {layoutToName(this.props.layout)}
          </a>
          <input
            type="text"
            placeholder="Filter"
            style={{ marginLeft: 'auto' }}
            ref={(input) => { this.searchInput = input; }}
            onChange={this.handleSearchInputChange}
            defaultValue={this.props.searchQuery}
          />
        </div>
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    layout: state.userInterface.linkLayout,
    searchQuery: state.userInterface.searchQuery
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeLayout: changeLinkLayout, changeSearchQuery }, dispatch);
}

const PROFILE_QUERY = gql`
  query NotesForList {
    notes {
      ... on INote {
        type
        _id
        name
        createdAt
        description
        tags {
          _id
          name
          color
        }
      }
      ... on Link {
        url
        domain
      }
    }
  }
`;
const withData = graphql(PROFILE_QUERY, {
  options: {
    fetchPolicy: 'cache-and-network',
  },
  props: ({ data: { loading, notes, refetch } }) => ({
    loading,
    notes,
    refetch
  }),
});

export default compose(
  withData,
  withAddTagMutation,
  withRemoveTagMutation,
  connect(mapStateToProps, mapDispatchToProps)
)(NotesPage);
