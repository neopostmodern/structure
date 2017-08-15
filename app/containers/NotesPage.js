// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { gql, graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';

import {
  withAddTagMutation, withRemoveTagMutation,
  withToggleArchivedMutation
} from '../wrappers/tags'
import NotesList from '../components/NotesList';
import {
  changeLinkLayout, changeSearchQuery, increaseInfiniteScroll, LinkLayouts,
  LinkLayoutType
} from '../actions/userInterface';

import styles from './NotesPage.css';

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
  moreElement: HTMLElement;

  props: {
    loading: boolean,
    notes?: Array<{ _id: string, url: string, createdAt: number }>,
    layout: LinkLayoutType,
    searchQuery: string,
    infiniteScrollLimit: number,
    graphQlError?: Object,

    addTagByNameToNote: (linkId: string, tag: string) => void,
    removeTagByIdFromNote: (linkId: string, tagId: string) => void,
    toggleArchivedNote: (noteId: string) => void,

    changeLayout: (layout: LinkLayoutType) => void,
    changeSearchQuery: (query: string) => void,
    increaseInfiniteScroll: (by: number) => void,
    refetch: () => void,
  };

  static textIncludes(needle?: string, haystack?: string): boolean {
    if (!haystack || !needle) {
      return false;
    }

    return haystack.toLowerCase().includes(needle.toLowerCase());
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyboardEvent, true);
    window.addEventListener('scroll', this.handleScrollEvent);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyboardEvent, true);
    window.removeEventListener('scroll', this.handleScrollEvent);
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

  handleScrollEvent = (event: Event) => {
    if (!this.moreElement) {
      return;
    }

    if (this.moreElement.getBoundingClientRect().top < window.innerHeight) {
      this.props.increaseInfiniteScroll(20);
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

  filteredNotes() {
    const notes = this.props.notes || [];

    if (this.props.searchQuery.length === 0) {
      return notes;
    }

    return notes.filter((note) =>
      NotesPage.textIncludes(this.props.searchQuery, note.url)
      || NotesPage.textIncludes(this.props.searchQuery, note.name)
      || note.tags.some((tag) => NotesPage.textIncludes(this.props.searchQuery, tag.name))
    );
  }

  render() {
    let content;
    let matchedNotes;
    if (this.props.graphQlError) {
      let fullErrorMessage;
      try {
        fullErrorMessage = <pre>{JSON.stringify(this.props.graphQlError, null, 2)}</pre>;
      } catch (e) {
        fullErrorMessage = <div>Complete error message couldn't be displayed.</div>;
      }
      content = (
        <div className={styles.errorContainer}>
          <h1>Network error.</h1>
          <button
            type="button"
            onClick={() => this.props.refetch()}
            className={styles.errorReloadButton}
            autoFocus
          >
            Reload
          </button>
          <div className={styles.errorInformation}>
            <h3>Further information</h3>
            <div>{this.props.graphQlError.message}</div>
            {fullErrorMessage}
          </div>
        </div>
      );
    } else {
      if (!this.props.loading) {
        if (this.props.layout === LinkLayouts.LIST_LAYOUT) {
          const currentLength = this.props.infiniteScrollLimit;
          matchedNotes = this.filteredNotes();
          content = [
            <NotesList
              key="notes-list"
              notes={matchedNotes.slice(0, currentLength)}
              addTagToNote={this.props.addTagByNameToNote}
              onRemoveTagFromNote={this.props.removeTagByIdFromNote}
              onToggleArchived={this.props.toggleArchivedNote}
            />
          ];
          if (matchedNotes.length > currentLength) {
            content.push(
              <div key="more" className={styles.more} ref={(element) => this.moreElement = element}>
                ({matchedNotes.length - currentLength} remaining)
              </div>
            );
          }
        } else {
          content = <i>Unsupported layout</i>;
        }
      } else {
        content = <i>Loading...</i>;
      }
    }
    return (
      <div>
        <div className={styles.menu}>
          <Link to="/notes/add">Add new</Link>,&nbsp;
          <a onClick={this.toggleLayout}>
            {layoutToName(this.props.layout)}
          </a>
          <div style={{ marginLeft: 'auto' }}>
            <input
              type="text"
              placeholder="Filter"
              ref={(input) => { this.searchInput = input; }}
              onChange={this.handleSearchInputChange}
              defaultValue={this.props.searchQuery}
            />
            <div style={{ textAlign: 'right', fontSize: '50%', marginTop: '0.3em' }}>
              {(this.props.notes && matchedNotes) && `${matchedNotes.length} / ${this.props.notes.length}`}
            </div>
          </div>
        </div>
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    layout: state.userInterface.linkLayout,
    searchQuery: state.userInterface.searchQuery,
    infiniteScrollLimit: state.userInterface.infiniteScrollLimit,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    changeLayout: changeLinkLayout,
    changeSearchQuery,
    increaseInfiniteScroll
  }, dispatch);
}

const PROFILE_QUERY = gql`
  query NotesForList {
    notes {
      ... on INote {
        type
        _id
        name
        createdAt
        archivedAt
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
  props: ({ data: { loading, notes, refetch, error } }) => ({
    loading,
    notes,
    refetch,
    graphQlError: error
  }),
});

export default compose(
  withData,
  withAddTagMutation,
  withRemoveTagMutation,
  withToggleArchivedMutation,
  connect(mapStateToProps, mapDispatchToProps)
)(NotesPage);
