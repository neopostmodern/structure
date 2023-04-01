import { gql, useQuery } from '@apollo/client';
import { CircularProgress, Stack, Typography } from '@mui/material';
import Mousetrap from 'mousetrap';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  increaseInfiniteScroll,
  LinkLayout,
} from '../../actions/userInterface';
import Centered from '../../components/Centered';
import FatalApolloError from '../../components/FatalApolloError';
import Gap from '../../components/Gap';
import NetworkOperationsIndicator, {
  NetworkIndicatorContainer,
} from '../../components/NetworkOperationsIndicator';
import NoteBatchEditingBar from '../../components/NoteBatchEditingBar';
import NotesList from '../../components/NotesList';
import NotesMenu from '../../components/NotesMenu';
import NotesPageEmpty from '../../components/NotesPageEmpty';
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
  const { linkLayout: layout, infiniteScrollLimit } = useSelector<
    RootState,
    UserInterfaceStateType
  >((state) => state.userInterface);
  const dispatch = useDispatch();
  const searchInput = useRef<HTMLInputElement | null>(null);
  const moreElement = useRef<HTMLDivElement | null>(null);
  const notesQuery = useDataState(
    useQuery<NotesForListQuery>(NOTES_QUERY, {
      fetchPolicy: 'cache-only',
    })
  );
  const filteredNotesQueryWrapper = useFilteredNotes(notesQuery);

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

    Mousetrap.bind(searchFieldShortcutKeys, (event: KeyboardEvent): void => {
      event.preventDefault();
      searchInput.current?.focus();
      setTimeout(
        () =>
          searchInput.current?.setSelectionRange(
            0,
            searchInput.current?.value.length
          ),
        10
      );
    });
    window.addEventListener('scroll', handleScrollEvent);

    return (): void => {
      Mousetrap.unbind(searchFieldShortcutKeys);
      window.removeEventListener('scroll', handleScrollEvent);
    };
  }, []);

  useEffect(() => {
    Mousetrap.bind('r', () => {
      entitiesUpdatedSince.refetch();
    });

    return () => {
      Mousetrap.unbind('r');
    };
  }, [entitiesUpdatedSince]);

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
      notesQuery.state === DataState.DATA &&
      notesQuery.data.notes.length > 0
    ) {
      content.push(
        <NotesPageEmpty
          key="empty-search-filter"
          archivedMatchedNotesCount={archivedMatchedNotesCount}
        />
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
        matchedNotes={matchedNotes}
        notes={allNotes}
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
