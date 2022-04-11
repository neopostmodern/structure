import { gql, useQuery } from '@apollo/client';
import Mousetrap from 'mousetrap';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  ArchiveState,
  changeArchiveState,
  changeLinkLayout,
  changeSearchQuery,
  increaseInfiniteScroll,
  LinkLayout,
  setBatchSelected,
  setBatchSelection,
  toggleBatchEditing,
} from '../../actions/userInterface';
import FatalApolloError from '../../components/FatalApolloError';
import { StickyMenu } from '../../components/Menu';
import NotesList from '../../components/NotesList';
import NotesMenu from '../../components/NotesMenu';
import { NotesForList, NotesForList_notes } from '../../generated/NotesForList';
import { RootState } from '../../reducers';
import {
  BatchSelectionType,
  UserInterfaceStateType,
} from '../../reducers/userInterface';
import gracefulNetworkPolicy from '../../utils/gracefulNetworkPolicy';
import useDataState, { DataState } from '../../utils/useDataState';
import ComplexLayout from '../ComplexLayout';

export const BASE_NOTE_FRAGMENT = gql`
  fragment BaseNote on INote {
    ... on INote {
      # type
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
`;

export const NOTES_QUERY = gql`
  query NotesForList {
    notes {
      ...BaseNote
    }
  }
  ${BASE_NOTE_FRAGMENT}
`;

const searchFieldShortcutKeys = ['ctrl+f', 'command+f'];
const toggleBatchEditingShortcutKeys = ['ctrl+b', 'command+b'];
const selectAllShortcutKeys = ['ctrl+a', 'command+a'];
const reloadShortcutKeys = ['ctrl+r', 'command+r'];

const textIncludes = (needle?: string, haystack?: string): boolean => {
  if (!haystack || !needle) {
    return false;
  }

  return haystack.toLowerCase().includes(needle.toLowerCase());
};

const filterNotes = (
  notes: Array<NotesForList_notes>,
  searchQuery: string,
  archiveState: ArchiveState
) => {
  let filteredNotes = notes;
  if (searchQuery.length !== 0) {
    filteredNotes = filteredNotes.filter(
      (note) =>
        ('url' in note && textIncludes(searchQuery, note.url)) ||
        textIncludes(searchQuery, note.name) ||
        note.tags.some((tag) => textIncludes(searchQuery, tag.name))
    );
  }

  const completeCount = filteredNotes.length;
  let archivedCount;

  if (archiveState === ArchiveState.ONLY_ARCHIVE) {
    filteredNotes = filteredNotes.filter((note) => Boolean(note.archivedAt));
    archivedCount = notes.length;
  } else if (archiveState === ArchiveState.NO_ARCHIVE) {
    filteredNotes = filteredNotes.filter((note) => !note.archivedAt);
    archivedCount = completeCount - filteredNotes.length;
  }

  return {
    notes: filteredNotes,
    archivedCount,
  };
};

const ShowMore = styled.div`
  color: black;
  background-color: #eee;
  text-align: center;
  padding: 1em;
`;

const NotesPage: React.FC = () => {
  const {
    linkLayout: layout,
    archiveState,
    searchQuery,
    infiniteScrollLimit,
    batchEditing,
    batchSelections,
  } = useSelector<RootState, UserInterfaceStateType>(
    (state) => state.userInterface
  );
  const dispatch = useDispatch();
  const searchInput = useRef<HTMLInputElement | null>(null);
  const moreElement = useRef<HTMLDivElement | null>(null);
  const notesQuery = useDataState(
    useQuery<NotesForList>(NOTES_QUERY, {
      fetchPolicy: gracefulNetworkPolicy(),
    })
  );

  const selectedNoteCount = (): number =>
    Object.values(batchSelections).filter((selected) => selected).length;

  const selectUnselectAll = (selected?: boolean): void => {
    if (notesQuery.state !== DataState.DATA) {
      return;
    }

    let nextSelectedState = selected;
    const selection: BatchSelectionType = {};
    const filteredNotes = filterNotes(
      notesQuery.data.notes,
      searchQuery,
      archiveState
    ).notes;
    if (typeof selected === 'undefined') {
      // if no selected target is passed in and all notes are selected, unselect them instead
      nextSelectedState = filteredNotes.length !== selectedNoteCount();
    }
    filteredNotes.forEach((note) => {
      selection[note._id] = nextSelectedState as boolean;
    });
    dispatch(setBatchSelection(selection));
  };

  useEffect(() => {
    const handleScrollEvent = () => {
      if (!moreElement.current) {
        return;
      }

      if (
        moreElement.current.getBoundingClientRect().top < window.innerHeight
      ) {
        dispatch(increaseInfiniteScroll(20));
      }
    };

    Mousetrap.bind(searchFieldShortcutKeys, (): void => {
      searchInput.current?.focus();
      setTimeout(
        () => searchInput.current?.setSelectionRange(0, searchQuery.length),
        10
      );
    });
    Mousetrap.bind(toggleBatchEditingShortcutKeys, (): void => {
      dispatch(toggleBatchEditing());
    });
    Mousetrap.bind(selectAllShortcutKeys, (): false => {
      // if we're not already batch editing switch to batch editing mode
      if (!batchEditing) {
        dispatch(toggleBatchEditing());
      }

      selectUnselectAll();

      return false;
    });
    Mousetrap.bind(reloadShortcutKeys, () => notesQuery.refetch());
    window.addEventListener('scroll', handleScrollEvent);

    return (): void => {
      Mousetrap.unbind(searchFieldShortcutKeys);
      Mousetrap.unbind(toggleBatchEditingShortcutKeys);
      Mousetrap.unbind(selectAllShortcutKeys);
      Mousetrap.unbind(reloadShortcutKeys);
      window.removeEventListener('scroll', handleScrollEvent);
    };
  }, []);

  const toggleLayout = (): void => {
    dispatch(
      changeLinkLayout(
        layout === LinkLayout.LIST_LAYOUT
          ? LinkLayout.GRID_LAYOUT
          : LinkLayout.LIST_LAYOUT
      )
    );
  };

  const nextArchiveState = (): void => {
    switch (archiveState) {
      case ArchiveState.ONLY_ARCHIVE:
        dispatch(changeArchiveState(ArchiveState.BOTH));
        break;
      case ArchiveState.BOTH:
        dispatch(changeArchiveState(ArchiveState.NO_ARCHIVE));
        break;
      case ArchiveState.NO_ARCHIVE:
        dispatch(changeArchiveState(ArchiveState.ONLY_ARCHIVE));
        break;
      default:
        console.error('Unknown layout', archiveState);
    }
  };

  const handleBatchOpenNotes = (): void => {
    if (notesQuery.state !== DataState.DATA) {
      return;
    }

    notesQuery.data.notes.forEach((note) => {
      if (!batchSelections[note._id]) {
        return;
      }
      if (note.__typename !== 'Link') {
        return;
      }
      window.open(note.url, '_blank', 'noopener, noreferrer');
    });
  };

  const content = [];
  let primaryActions = null;
  // todo: indicate background (re) fetch somewhere
  if (notesQuery.state === DataState.ERROR) {
    content.push(<FatalApolloError query={notesQuery} />);
  } else if (notesQuery.state === DataState.DATA) {
    const allNotes = [...notesQuery.data.notes]; // unfreeze
    allNotes.sort((noteA, noteB) => noteB.createdAt - noteA.createdAt);

    const { notes: matchedNotes, archivedCount: archivedMatchedNotesCount } =
      filterNotes(allNotes, searchQuery, archiveState);

    if (batchEditing) {
      content.push(
        <StickyMenu key="batch-operations-menu">
          {selectedNoteCount()} selected (
          <a onClick={(): void => selectUnselectAll(true)}>select all</a>
          ,&nbsp;
          <a onClick={(): void => selectUnselectAll(false)}>unselect all</a>
          ):&nbsp;
          <a onClick={handleBatchOpenNotes}>Open in browser</a>
        </StickyMenu>
      );
    }

    if (layout !== LinkLayout.LIST_LAYOUT) {
      content.push(<i>Unsupported layout</i>);
    } else {
      content.push(
        <NotesList
          key="notes-list"
          notes={matchedNotes.slice(0, infiniteScrollLimit)}
          batchEditing={batchEditing}
          batchSelections={batchSelections}
          onSetBatchSelected={(noteId, selected): void => {
            dispatch(setBatchSelected(noteId, selected));
          }}
        />
      );
      if (matchedNotes.length > infiniteScrollLimit) {
        content.push(
          <ShowMore key="more" ref={moreElement}>
            ({matchedNotes.length - infiniteScrollLimit} remaining)
          </ShowMore>
        );
      }
    }

    primaryActions = (
      <NotesMenu
        archiveState={archiveState}
        onChangeSearchQuery={(value: string): void => {
          dispatch(changeSearchQuery(value));
        }}
        layout={layout}
        toggleLayout={toggleLayout}
        matchedNotes={matchedNotes}
        nextArchiveState={nextArchiveState}
        notes={allNotes}
        searchQuery={searchQuery}
        searchInput={searchInput}
        archivedMatchedNotesCount={archivedMatchedNotesCount}
      />
    );
  }

  return (
    <ComplexLayout
      primaryActions={primaryActions}
      loading={notesQuery.state === DataState.LOADING}
    >
      {[...content]}
    </ComplexLayout>
  );
};

export default NotesPage;
