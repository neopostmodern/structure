// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { connect } from 'react-redux';

import {
  withAddTagMutation, withRemoveTagMutation,
  withToggleArchivedMutation
} from '../wrappers/tags';
import NotesList from '../components/NotesList';
import {
  changeLinkLayout, changeSearchQuery, increaseInfiniteScroll,
  ArchiveStateType, ArchiveStates,
  LinkLayouts, LinkLayoutType, changeArchiveState
} from '../actions/userInterface';
import { type NoteObject } from '../reducers/links';

import styles from './NotesPage.css';
import menuStyles from '../styles/menu.scss';

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

export function archiveStateToName(archiveState: ArchiveStateType) {
  switch (archiveState) {
    case ArchiveStates.ONLY_ARCHIVE:
      return 'Only archive';
    case ArchiveStates.BOTH:
      return 'Including archive';
    case ArchiveStates.NO_ARCHIVE:
      return 'Without archive';
    default:
      console.error('Unkown layout', archiveState);
      return 'Unknown layout';
  }
}

export class NotesPage extends React.Component {
  searchInput: HTMLInputElement;
  moreElement: HTMLElement;

  props: {
    loading: boolean,
    notes?: Array<NoteObject>,
    layout: LinkLayoutType,
    archiveState: ArchiveStateType,
    searchQuery: string,
    infiniteScrollLimit: number,
    graphQlError?: Object,

    addTagByNameToNote: (linkId: string, tag: string) => void,
    removeTagByIdFromNote: (linkId: string, tagId: string) => void,
    toggleArchivedNote: (noteId: string) => void,

    changeLayout: (layout: LinkLayoutType) => void,
    changeArchiveState: (layout: ArchiveStateType) => void,
    changeSearchQuery: (query: string) => void,
    increaseInfiniteScroll: (by: number) => void,
    refetch: () => void
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
          setTimeout(() => this.searchInput.select(0, this.props.searchQuery.length), 10);
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
  changeArchiveState = () => {
    switch (this.props.archiveState) {
      case ArchiveStates.ONLY_ARCHIVE:
        this.props.changeArchiveState(ArchiveStates.BOTH);
        break;
      case ArchiveStates.BOTH:
        this.props.changeArchiveState(ArchiveStates.NO_ARCHIVE);
        break;
      case ArchiveStates.NO_ARCHIVE:
        this.props.changeArchiveState(ArchiveStates.ONLY_ARCHIVE);
        break;
      default:
        console.error('Unkown layout', this.props.archiveState);
    }
  };

  handleSearchInputChange = () => {
    this.props.changeSearchQuery(this.searchInput.value);
  }

  filteredNotes() {
    let notes = this.props.notes || [];

    if (this.props.searchQuery.length !== 0) {
      notes = notes.filter((note) =>
        NotesPage.textIncludes(this.props.searchQuery, note.url)
        || NotesPage.textIncludes(this.props.searchQuery, note.name)
        || note.tags.some((tag) => NotesPage.textIncludes(this.props.searchQuery, tag.name))
      );
    }

    const completeCount = notes.length;
    let archivedCount;

    if (this.props.archiveState === ArchiveStates.ONLY_ARCHIVE) {
      notes = notes.filter(note => Boolean(note.archivedAt));
      archivedCount = notes.length;
    } else if (this.props.archiveState === ArchiveStates.NO_ARCHIVE) {
      notes = notes.filter(note => !note.archivedAt);
      archivedCount = completeCount - notes.length;
    }

    return {
      notes,
      archivedCount
    };
  }

  noteCount(matchedNotes?: Array<NoteObject>, archivedMatchedNotesCount?: number) {
    if (this.props.notes && matchedNotes) {
      let totalNotes = this.props.notes.length;
      const archivedNotesCount = this.props.notes.filter(note => Boolean(note.archivedAt)).length;
      let displayableNoteCount = totalNotes;
      if (this.props.archiveState === ArchiveStates.ONLY_ARCHIVE) {
        displayableNoteCount = archivedNotesCount;
        totalNotes = `(${this.props.notes.length - archivedNotesCount}+) ${archivedNotesCount}`;
      } else if (this.props.archiveState === ArchiveStates.NO_ARCHIVE) {
        displayableNoteCount = this.props.notes.length - archivedNotesCount;
        totalNotes = `${this.props.notes.length - archivedNotesCount} (+${archivedNotesCount})`;
      }
      if (matchedNotes.length === displayableNoteCount) {
        return totalNotes;
      }

      let matchedNotesCount = matchedNotes.length;
      if (this.props.archiveState === ArchiveStates.ONLY_ARCHIVE) {
        matchedNotesCount = `(${matchedNotes.length - archivedMatchedNotesCount}+) ${archivedMatchedNotesCount}`;
      } else if (this.props.archiveState === ArchiveStates.NO_ARCHIVE) {
        if (archivedMatchedNotesCount && archivedMatchedNotesCount > 0) {
          matchedNotesCount = `${matchedNotes.length} (+${archivedMatchedNotesCount})`;
        }
      }

      return `${matchedNotesCount} / ${totalNotes}`;
    }
  }

  render() {
    let content;
    let matchedNotes;
    let archivedMatchedNotesCount;
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
    } else if (!this.props.loading) {
      if (this.props.layout === LinkLayouts.LIST_LAYOUT) {
        const currentLength = this.props.infiniteScrollLimit;
        const filteredNotes = this.filteredNotes();
        matchedNotes = filteredNotes.notes;
        archivedMatchedNotesCount = filteredNotes.archivedCount;
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
    return (
      <div>
        <div className={menuStyles.menu}>
          <Link to="/notes/add">Add new</Link>,&nbsp;
          <a onClick={this.toggleLayout}>
            {layoutToName(this.props.layout)}
          </a>,&nbsp;
          <a onClick={this.changeArchiveState}>
            {archiveStateToName(this.props.archiveState)}
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
              {this.noteCount(matchedNotes, archivedMatchedNotesCount)}
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
    archiveState: state.userInterface.archiveState,
    searchQuery: state.userInterface.searchQuery,
    infiniteScrollLimit: state.userInterface.infiniteScrollLimit,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    changeLayout: changeLinkLayout,
    changeArchiveState,
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
