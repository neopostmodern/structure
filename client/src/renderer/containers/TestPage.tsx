import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers';
import SearchTest from '../components/SearchTest';
import NetworkOperationsIndicator from '../components/NetworkOperationsIndicator';
import NotesList from '../components/NotesList';
import useEntitiesUpdatedSince from '../hooks/useEntitiesUpdatedSince';
import ComplexLayout from './ComplexLayout';

const TestPage: React.FC = () => {
  useMemo(() => {
    performance.mark('testpage:start');
  }, []);
  const searchQuery = useSelector<RootState, string>(
    (state) => state.userInterface.searchQuery,
  );
  const skipSearch = !searchQuery;
  console.log('skip search', skipSearch);

  const notesCacheQuery = useQuery(
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
      }
    `,
    {
      fetchPolicy: 'cache-only',
    },
  );
  const tagsCacheQuery = useQuery(
    gql`
      query TagsTest {
        tags {
          _id
          name
        }
      }
    `,
    { fetchPolicy: 'cache-only', skip: skipSearch },
  );

  const sortedNoteIds = useMemo(() => {
    if (notesCacheQuery.dataState !== 'complete') {
      return 'loading';
    }

    // todo: it seems with the query like above it should be okay to do filtering here instead of in the notes?

    let noteIds = [...notesCacheQuery.data.notes];

    noteIds.sort((a, b) => b.updatedAt - a.updatedAt);
    return noteIds;
  }, [notesCacheQuery]);

  const sortedAndFilteredNoteIds = useMemo(() => {
    if (skipSearch) {
      return sortedNoteIds;
    }

    const matchedTags = tagsCacheQuery.data.tags
      .filter((tag) => tag.name.includes(searchQuery))
      .map(({ _id }) => _id);
    return sortedNoteIds.filter(
      (note) =>
        note.name.includes(searchQuery) ||
        note.tags.some((tag) => matchedTags.includes(tag._id)),
    );
  }, [sortedNoteIds, tagsCacheQuery.data, searchQuery]);

  console.log('cache query', notesCacheQuery);

  console.log(
    `Filtered for '${searchQuery}' and found ${sortedAndFilteredNoteIds.length}`,
  );

  const entitiesUpdatedSince = useEntitiesUpdatedSince();
  // console.log('updated since', entitiesUpdatedSince);

  console.log(performance.measure('testpage-render', 'testpage:start'));

  return (
    <ComplexLayout
      loading={notesCacheQuery.loading}
      primaryActions={<SearchTest />}
    >
      <NetworkOperationsIndicator
        key="refresh-indicator"
        query={entitiesUpdatedSince}
      />
      {sortedAndFilteredNoteIds !== 'loading' && (
        <NotesList
          noteIds={sortedAndFilteredNoteIds}
          initialCount={15}
          expanded={false}
        />
      )}
    </ComplexLayout>
  );
};

export default TestPage;
