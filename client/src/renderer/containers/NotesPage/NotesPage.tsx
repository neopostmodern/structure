import { gql, useLazyQuery } from '@apollo/client';
import { CloudOff } from '@mui/icons-material';
import { CircularProgress, Stack, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
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
import { SkeletonNoteList } from '../../components/Skeletons';
import {
  NotesForListQuery,
  NotesForListQueryVariables,
} from '../../generated/graphql';
import useEntitiesUpdatedSince from '../../hooks/useEntitiesUpdatedSince';
import useFilteredNotes, {
  FilteredNotesAndAllNotes,
} from '../../hooks/useFilteredNotes';
import useIsOnline from '../../hooks/useIsOnline';
import useOptimisticCache from '../../hooks/useOptimisticCache';
import useShortcut from '../../hooks/useShortcut';
import { RootState } from '../../reducers';
import { UserInterfaceStateType } from '../../reducers/userInterface';
import { SHORTCUTS } from '../../utils/keyboard';
import {
  BASE_NOTE_FRAGMENT,
  BASE_TAG_FRAGMENT,
} from '../../utils/sharedQueriesAndFragments';
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
          ...BaseTag
        }
      }
    }
  }
  ${BASE_NOTE_FRAGMENT}
  ${BASE_TAG_FRAGMENT}
`;

export const OPTIMISTIC_NOTE_COUNT = 10;

const NotesPage: React.FC = () => {
  const { linkLayout: layout, infiniteScrollLimit } = useSelector<
    RootState,
    UserInterfaceStateType
  >((state) => state.userInterface);
  const [noteRenderLimit, setNoteRenderLimit] = useState<null | number>(
    OPTIMISTIC_NOTE_COUNT
  );
  const dispatch = useDispatch();
  const searchInput = useRef<HTMLInputElement | null>(null);
  const [fetchNotesQuery, notesQuery] = useDataState(
    useLazyQuery<NotesForListQuery>(NOTES_QUERY, {
      fetchPolicy: 'cache-only',
    })
  );
  useEffect(() => {
    setTimeout(fetchNotesQuery, 100);
  }, []);
  const filteredNotesQueryWrapper = useFilteredNotes(notesQuery);
  const cachedFilteredNotesQueryWrapper = useOptimisticCache<
    FilteredNotesAndAllNotes,
    NotesForListQueryVariables,
    NotesForListQuery
  >(filteredNotesQueryWrapper, 'notes', ({ notes, archivedCount }) => ({
    allNotes: null as any, // hack, will not render notes stats from optimistic cache
    notes: notes.slice(0, OPTIMISTIC_NOTE_COUNT),
    archivedCount,
  }));

  const entitiesUpdatedSince = useEntitiesUpdatedSince();

  useShortcut(SHORTCUTS.SEARCH, () => {
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

  const { ref: showMoreElement, inView } = useInView({
    rootMargin: '0% 0% 20% 0%', // triggers 20vh below viewport
  });

  // 'rerun' is a dummy variable with no meaning to trigger a re-run of below
  // hook to check if the element is still in view
  const [rerun, setRerun] = useState(false);
  useEffect(() => {
    if (
      !inView ||
      (noteRenderLimit === null &&
        cachedFilteredNotesQueryWrapper.state === DataState.DATA &&
        cachedFilteredNotesQueryWrapper.data.notes.length < infiniteScrollLimit)
    ) {
      return;
    }
    if (noteRenderLimit && noteRenderLimit < infiniteScrollLimit) {
      setNoteRenderLimit(null);
    } else {
      dispatch(increaseInfiniteScroll(10));
    }

    const rerunTimeout = setTimeout(() => {
      setRerun(!rerun);
    }, 100);

    return (): void => {
      clearTimeout(rerunTimeout);
    };
  }, [inView, rerun, setRerun]);

  useShortcut(SHORTCUTS.REFRESH, () => {
    entitiesUpdatedSince.refetch();
  });

  const isOnline = useIsOnline();

  const content = [];
  let primaryActions = null;

  if (cachedFilteredNotesQueryWrapper.state === DataState.ERROR) {
    if (
      cachedFilteredNotesQueryWrapper.error.extraInfo === OFFLINE_CACHE_MISS &&
      (entitiesUpdatedSince.state === DataState.UNCALLED ||
        entitiesUpdatedSince.state === DataState.LOADING)
    ) {
      content.push(
        <Centered key="first-load">
          <Stack alignItems="center">
            {isOnline ? (
              <>
                <CircularProgress color="inherit" disableShrink />
                <Gap vertical={1} />
                <Typography variant="caption">
                  Loading notes for the first time, this might take a while...
                </Typography>
              </>
            ) : (
              <>
                <CloudOff sx={{ fontSize: '4rem', color: 'gray' }} />
                <Gap vertical={1} />
                <Typography variant="caption" textAlign="center">
                  Your notes are not cached yet and can't be loaded at the
                  moment because you're offline.
                  <br /> Please try again later.
                </Typography>
              </>
            )}
          </Stack>
        </Centered>
      );
    } else {
      content.push(
        <FatalApolloError key="error" query={cachedFilteredNotesQueryWrapper} />
      );
    }
  } else if (cachedFilteredNotesQueryWrapper.state === DataState.DATA) {
    if (cachedFilteredNotesQueryWrapper.loadingBackground) {
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
    } = cachedFilteredNotesQueryWrapper.data;

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
          notes={matchedNotes.slice(0, noteRenderLimit || infiniteScrollLimit)}
          expanded={layout === LinkLayout.EXPANDED_LIST_LAYOUT}
        />,
        <div key="more" ref={showMoreElement}>
          {matchedNotes.length > infiniteScrollLimit &&
            noteRenderLimit === null && (
              <>
                <SkeletonNoteList />
                <Gap vertical={2} />
                <Typography
                  variant="caption"
                  color="gray"
                  textAlign="center"
                  component="div"
                >
                  {matchedNotes.length - infiniteScrollLimit} more notes
                  loading...
                </Typography>
              </>
            )}
        </div>
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
      loading={cachedFilteredNotesQueryWrapper.state === DataState.LOADING}
      loadingComponent={SkeletonNoteList}
    >
      {[...content]}
    </ComplexLayout>
  );
};

export default NotesPage;
