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
} from '../../actions/userInterface';
import FatalApolloError from '../../components/FatalApolloError';
import NetworkOperationsIndicator, {
  NetworkIndicatorContainer,
} from '../../components/NetworkOperationsIndicator';
import NoteBatchEditingBar from '../../components/NoteBatchEditingBar';
import NotesList from '../../components/NotesList';
import NotesMenu from '../../components/NotesMenu';
import { NotesForList } from '../../generated/NotesForList';
import useFilteredNotes from '../../hooks/useFilteredNotes';
import { RootState } from '../../reducers';
import { UserInterfaceStateType } from '../../reducers/userInterface';
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
const reloadShortcutKeys = ['ctrl+r', 'command+r'];

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
  const filteredNotesQueryWrapper = useFilteredNotes(
    notesQuery,
    searchQuery,
    archiveState
  );

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
    Mousetrap.bind(reloadShortcutKeys, () => notesQuery.refetch());
    window.addEventListener('scroll', handleScrollEvent);

    return (): void => {
      Mousetrap.unbind(searchFieldShortcutKeys);
      Mousetrap.unbind(reloadShortcutKeys);
      window.removeEventListener('scroll', handleScrollEvent);
    };
  }, []);

  const toggleLayout = (): void => {
    dispatch(
      changeLinkLayout(
        layout === LinkLayout.LIST_LAYOUT
          ? LinkLayout.EXPANDED_LIST_LAYOUT
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

  const content = [];
  let primaryActions = null;

  if (filteredNotesQueryWrapper.state === DataState.ERROR) {
    content.push(
      <FatalApolloError key="error" query={filteredNotesQueryWrapper} />
    );
  } else if (filteredNotesQueryWrapper.state === DataState.DATA) {
    if (filteredNotesQueryWrapper.loadingBackground) {
      content.push(
        <NetworkIndicatorContainer key="searching" align="left">
          Filtering...
        </NetworkIndicatorContainer>
      );
    }

    const {
      allNotes,
      notes: matchedNotes,
      archivedCount: archivedMatchedNotesCount,
    } = filteredNotesQueryWrapper.data;

    content.push(
      <NoteBatchEditingBar key="batch-operations-menu" notes={matchedNotes} />
    );

    content.push(
      <NetworkOperationsIndicator key="refresh-indicator" query={notesQuery} />
    );

    content.push(
      <NotesList
        key="notes-list"
        notes={matchedNotes.slice(0, infiniteScrollLimit)}
        expanded={layout === LinkLayout.EXPANDED_LIST_LAYOUT}
      />
    );

    if (matchedNotes.length > infiniteScrollLimit) {
      content.push(
        <ShowMore key="more" ref={moreElement}>
          ({matchedNotes.length - infiniteScrollLimit} remaining)
        </ShowMore>
      );
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
      loading={filteredNotesQueryWrapper.state === DataState.LOADING}
    >
      {[...content]}
    </ComplexLayout>
  );
};

export default NotesPage;
