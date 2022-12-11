import { ApolloError } from '@apollo/client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArchiveState, SortBy } from '../actions/userInterface';
import { NotesForListQuery } from '../generated/graphql';
import {
  DataState,
  SelectedApolloQueryResultFields,
  UseDataStateResult,
} from '../utils/useDataState';

const textIncludes = (needle?: string, haystack?: string): boolean => {
  if (!haystack || !needle) {
    return false;
  }

  return haystack.toLowerCase().includes(needle.toLowerCase());
};

interface FilteredNotes {
  notes: NotesForListQuery['notes'];
  archivedCount: number | undefined;
}
const filterNotes = (
  notes: NotesForListQuery['notes'],
  searchQuery: string,
  archiveState: ArchiveState
): FilteredNotes => {
  let filteredNotes = notes.filter((note) => !note.deletedAt);
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

type FilteredNotesAndAllNotes = FilteredNotes & {
  allNotes: NotesForListQuery['notes'];
};

type PolicedFilteredNotes =
  | ({ state: DataState.LOADING } & SelectedApolloQueryResultFields<
      NotesForListQuery,
      undefined
    >)
  | ({
      state: DataState.ERROR;
      error: ApolloError;
    } & SelectedApolloQueryResultFields<NotesForListQuery, undefined>)
  | {
      state: DataState.DATA;
      data: FilteredNotesAndAllNotes;
      loadingBackground: boolean;
    };

const sortByToFieldName: {
  [sortBy in SortBy]: keyof NotesForListQuery['notes'][number];
} = {
  [SortBy.CREATED_AT]: 'createdAt',
  [SortBy.UPDATED_AT]: 'updatedAt',
};

const useFilteredNotes = (
  notesQuery: UseDataStateResult<NotesForListQuery, undefined>,
  searchQuery: string,
  archiveState: ArchiveState,
  sortBy: SortBy
): PolicedFilteredNotes => {
  const [isFilteringNotes, setIsFilteringNotes] = useState(false);
  const [filteredNotes, setFilteredNotes] =
    useState<null | FilteredNotesAndAllNotes>(null);
  const timeoutRef = useRef<null | NodeJS.Timeout>(null);
  const allNotes = useMemo<NotesForListQuery['notes'] | null>(() => {
    if (notesQuery.state !== DataState.DATA) {
      return null;
    }

    const notes = [...notesQuery.data.notes]; // unfreeze
    notes.sort(
      (noteA, noteB) =>
        noteB[sortByToFieldName[sortBy]] - noteA[sortByToFieldName[sortBy]]
    );
    return notes;
  }, ['data' in notesQuery && notesQuery.data, sortBy]);

  useEffect(() => {
    if (!allNotes) {
      return;
    }

    setIsFilteringNotes(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(
      () => {
        setFilteredNotes({
          allNotes,
          ...filterNotes(allNotes, searchQuery, archiveState),
        });
        setIsFilteringNotes(false);
      },
      searchQuery.length ? 100 : 0
    );
  }, [
    allNotes,
    searchQuery,
    archiveState,
    setIsFilteringNotes,
    setFilteredNotes,
  ]);

  if (notesQuery.state !== DataState.DATA) {
    return notesQuery;
  }

  if (!filteredNotes) {
    return { ...notesQuery, state: DataState.LOADING };
  }

  return {
    ...notesQuery,
    data: filteredNotes,
    loadingBackground: isFilteringNotes,
  };
};

export default useFilteredNotes;
