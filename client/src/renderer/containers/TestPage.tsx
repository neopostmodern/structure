import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import ComplexLayout from './ComplexLayout';
import NoteTest from '../components/NoteTest';
import SearchTest from '../components/SearchTest';
import useEntitiesUpdatedSince from '../hooks/useEntitiesUpdatedSince';
import NetworkOperationsIndicator from '../components/NetworkOperationsIndicator';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reducers';
import { UserInterfaceStateType } from '../reducers/userInterface';

export const OPTIMISTIC_NOTE_COUNT = 10;

const TestPage: React.FC = () => {
  const cacheQuery = useQuery(
    gql`
      query NotesTest {
        notes {
          _id
          updatedAt
          name
          tags {
            _id
          }
        }
        tags {
          _id
          name
        }
      }
    `,
    {
      fetchPolicy: 'cache-only',
    },
  );

  const { searchQuery } = useSelector<RootState, UserInterfaceStateType>(
    (state) => state.userInterface,
  );

  const sortedNoteIds = useMemo(() => {
    if (cacheQuery.dataState !== 'complete') {
      return 'loading';
    }

    // todo: it seems with the query like above it should be okay to do filtering here instead of in the notes?

    let noteIds = [...cacheQuery.data.notes];

    noteIds.sort((a, b) => b.updatedAt - a.updatedAt);
    return noteIds;
  }, [cacheQuery]);

  const sortedAndFilteredNoteIds = useMemo(() => {
    if (!searchQuery) {
      return sortedNoteIds;
    }

    const matchedTags = cacheQuery.data.tags
      .filter((tag) => tag.name.includes(searchQuery))
      .map(({ _id }) => _id);
    return sortedNoteIds.filter(
      (note) =>
        note.name.includes(searchQuery) ||
        note.tags.some((tag) => matchedTags.includes(tag._id)),
    );
  }, [sortedNoteIds, searchQuery]);

  console.log('cache query', cacheQuery);

  console.log(
    `Filtered for '${searchQuery}' and found ${sortedAndFilteredNoteIds.length}`,
  );

  const entitiesUpdatedSince = useEntitiesUpdatedSince();
  console.log('updated since', entitiesUpdatedSince);

  const [notesLimit, setNotesLimit] = useState(15);

  const { ref: showMoreElement, inView } = useInView({
    rootMargin: '0% 0% 20% 0%', // triggers 20vh below viewport
  });
  const firstRenderTimestamp = useMemo(() => {
    return Date.now();
  }, []);
  const heuristicFirstContentfulPaintComplete =
    Date.now() - firstRenderTimestamp > 1000;
  useEffect(() => {
    // todo: wait until first full render finished
    if (heuristicFirstContentfulPaintComplete && inView) {
      setNotesLimit((limit) => limit + OPTIMISTIC_NOTE_COUNT);
    }
  }, [inView, setNotesLimit, heuristicFirstContentfulPaintComplete]);

  console.log(
    'in view',
    inView,
    'limit',
    notesLimit,
    'heuristic complete',
    heuristicFirstContentfulPaintComplete,
  );

  let content = null;
  if (sortedAndFilteredNoteIds !== 'loading') {
    content = sortedAndFilteredNoteIds
      .slice(0, notesLimit)
      .map(({ _id }) => <NoteTest key={_id} noteId={_id} />);

    console.log('content', content);
  }

  return (
    <ComplexLayout loading={cacheQuery.loading} primaryActions={<SearchTest />}>
      <NetworkOperationsIndicator
        key="refresh-indicator"
        query={entitiesUpdatedSince}
      />
      {content}
      {sortedAndFilteredNoteIds.length > notesLimit && (
        <div ref={showMoreElement}>
          more... (showing {notesLimit} of {sortedAndFilteredNoteIds.length}{' '}
          notes)
        </div>
      )}
    </ComplexLayout>
  );
};

export default TestPage;
