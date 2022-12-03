import { gql, useQuery } from '@apollo/client';
import { ScreenSearchDesktop } from '@mui/icons-material';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
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
import Centered from '../../components/Centered';
import EmptyPageInfo from '../../components/EmptyPageInfo';
import FatalApolloError from '../../components/FatalApolloError';
import Gap from '../../components/Gap';
import NetworkOperationsIndicator, {
  NetworkIndicatorContainer,
} from '../../components/NetworkOperationsIndicator';
import NoteBatchEditingBar from '../../components/NoteBatchEditingBar';
import NotesList from '../../components/NotesList';
import NotesMenu from '../../components/NotesMenu';
import Shortcut from '../../components/Shortcut';
import { NotesForListQuery } from '../../generated/graphql';
import useEntitiesUpdatedSince from '../../hooks/useEntitiesUpdatedSince';
import useFilteredNotes from '../../hooks/useFilteredNotes';
import { RootState } from '../../reducers';
import { UserInterfaceStateType } from '../../reducers/userInterface';
import { BASE_NOTE_FRAGMENT } from '../../utils/sharedQueriesAndFragments';
import useDataState, {
  DataState,
  OFFLINE_CACHE_MISS,
} from '../../utils/useDataState';
import ComplexLayout from '../ComplexLayout';

export const NOTES_QUERY = gql`
  query NotesForList {
    notes {
      ...BaseNote

      ... on INote {
        tags {
          _id
          name
          color
        }
      }
    }
  }
  ${BASE_NOTE_FRAGMENT}
`;

const searchFieldShortcutKeys =
  process.env.TARGET === 'web'
    ? ['ctrl+k', 'command+k']
    : ['ctrl+f', 'command+f'];

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
    useQuery<NotesForListQuery>(NOTES_QUERY, {
      fetchPolicy: 'cache-only',
    })
  );
  const filteredNotesQueryWrapper = useFilteredNotes(
    notesQuery,
    searchQuery,
    archiveState
  );

  const entitiesUpdatedSince = useEntitiesUpdatedSince();

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

    Mousetrap.bind(searchFieldShortcutKeys, (event): void => {
      event.preventDefault();
      searchInput.current?.focus();
      setTimeout(
        () => searchInput.current?.setSelectionRange(0, searchQuery.length),
        10
      );
    });
    window.addEventListener('scroll', handleScrollEvent);

    return (): void => {
      Mousetrap.unbind(searchFieldShortcutKeys);
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
    if (
      filteredNotesQueryWrapper.error.extraInfo === OFFLINE_CACHE_MISS &&
      (entitiesUpdatedSince.state === DataState.UNCALLED ||
        entitiesUpdatedSince.state === DataState.LOADING)
    ) {
      content.push(
        <Centered key="first-load">
          <Stack alignItems="center">
            <CircularProgress color="inherit" disableShrink />
            <Gap vertical={1} />
            <Typography variant="caption">
              Loading notes for the first time, this might take a while...
            </Typography>
          </Stack>
        </Centered>
      );
    } else {
      content.push(
        <FatalApolloError key="error" query={filteredNotesQueryWrapper} />
      );
    }
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
      <NetworkOperationsIndicator
        key="refresh-indicator"
        query={entitiesUpdatedSince}
      />
    );

    if (
      matchedNotes.length === 0 &&
      (searchQuery || archivedMatchedNotesCount > 0)
    ) {
      content.push(
        <EmptyPageInfo
          key="empty-search-filter"
          icon={ScreenSearchDesktop}
          title="Nothing matches your search or filters."
          subtitle={
            <>
              Did you know you can use{' '}
              <Shortcut ctrlOrCommand>
                {process.env.TARGET === 'web' ? 'K' : 'F'}
              </Shortcut>{' '}
              to focus the search field?
            </>
          }
          actions={
            <>
              {searchQuery && (
                <Button
                  variant="outlined"
                  onClick={() => dispatch(changeSearchQuery(''))}
                >
                  Reset search
                </Button>
              )}
              {archivedMatchedNotesCount > 0 && (
                <Button
                  variant="outlined"
                  onClick={() =>
                    dispatch(changeArchiveState(ArchiveState.BOTH))
                  }
                >
                  Include{' '}
                  {archiveState === ArchiveState.NO_ARCHIVE
                    ? 'archive'
                    : 'not archived'}
                </Button>
              )}
            </>
          }
        ></EmptyPageInfo>
      );
    } else {
      content.push(
        <NotesList
          key="notes-list"
          notes={matchedNotes.slice(0, infiniteScrollLimit)}
          expanded={layout === LinkLayout.EXPANDED_LIST_LAYOUT}
        />
      );
    }

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
