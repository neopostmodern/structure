import {
  gql,
  StoreObject,
  useApolloClient,
  useLazyQuery,
} from '@apollo/client';
import { useEffect } from 'react';
import { NOTES_QUERY } from '../containers/NotesPage/NotesPage';
import { TAGS_QUERY } from '../containers/TagsPage';
import {
  EntitiesUpdatedSinceQuery,
  EntitiesUpdatedSinceQueryVariables,
  NotesForListQuery,
  TagsQuery,
} from '../generated/graphql';
import {
  BASE_NOTE_FRAGMENT,
  BASE_TAG_FRAGMENT,
} from '../utils/sharedQueriesAndFragments';
import useDataState, { DataState } from '../utils/useDataState';
import useIsOnline from './useIsOnline';

export const ENTITIES_UPDATED_SINCE_QUERY = gql`
  query EntitiesUpdatedSince($updatedSince: Date!) {
    entitiesUpdatedSince(updatedSince: $updatedSince) {
      notes {
        ...BaseNote
      }
      tags {
        ...BaseTag
      }
      timestamp
    }
  }
  ${BASE_NOTE_FRAGMENT}
  ${BASE_TAG_FRAGMENT}
`;
export const ENTITIES_UPDATED_SINCE_STORAGE_KEY = 'updatedSince';
const getUpdatedSince = () =>
  parseInt(localStorage.getItem(ENTITIES_UPDATED_SINCE_STORAGE_KEY) as any) ||
  0;
const ENTITIES_UPDATED_SINCE_INTERVAL_MS = 60 * 1000;

const mergeNewlyCreatedIntoCache = <EntityType extends StoreObject>(
  cachedEntities: Array<EntityType>,
  newEntity: EntityType
) => {
  // by default insert at the end, but if note exists, override
  let noteIndexToUpdate = cachedEntities.findIndex(
    (noteInCache) => noteInCache._id === newEntity._id
  );
  if (noteIndexToUpdate === -1) {
    noteIndexToUpdate = cachedEntities.length;
  }

  cachedEntities[noteIndexToUpdate] = newEntity;
};

const useEntitiesUpdatedSince = () => {
  const apolloClient = useApolloClient();
  const isOnline = useIsOnline();

  const [fetchEntitiesUpdatedSince, entitiesUpdatedSince] = useDataState(
    useLazyQuery<EntitiesUpdatedSinceQuery, EntitiesUpdatedSinceQueryVariables>(
      ENTITIES_UPDATED_SINCE_QUERY,
      {
        onCompleted({ entitiesUpdatedSince }) {
          const { cache } = apolloClient;
          const lastUpdate = getUpdatedSince();

          if (entitiesUpdatedSince.notes.length) {
            const notesCacheValue = cache.readQuery<NotesForListQuery>({
              query: NOTES_QUERY,
            });

            let cachedNotes: NotesForListQuery['notes'];

            if (lastUpdate) {
              if (!notesCacheValue) {
                throw Error(
                  '[NotesPage: ENTITIES_UPDATED_SINCE_QUERY.onCompleted] Failed to read cache for notes.'
                );
              }

              cachedNotes = notesCacheValue.notes.slice();

              entitiesUpdatedSince.notes.forEach((note) => {
                if (note.createdAt > lastUpdate) {
                  mergeNewlyCreatedIntoCache(cachedNotes, note);
                }
              });
            } else {
              cachedNotes = entitiesUpdatedSince.notes;
            }

            cache.writeQuery({
              query: NOTES_QUERY,
              data: { notes: cachedNotes },
            });
          }

          if (entitiesUpdatedSince.tags.length) {
            const tagsCacheValue = cache.readQuery<TagsQuery>({
              query: TAGS_QUERY,
            });

            let cachedTags: TagsQuery['tags'];

            if (lastUpdate) {
              if (!tagsCacheValue) {
                throw Error(
                  '[NotesPage: ENTITIES_UPDATED_SINCE_QUERY.onCompleted] Failed to read cache for tags.'
                );
              }

              cachedTags = tagsCacheValue.tags.slice();

              entitiesUpdatedSince.tags.forEach((tag) => {
                if (tag.createdAt > lastUpdate) {
                  mergeNewlyCreatedIntoCache(cachedTags, tag);
                }
              });
            } else {
              cachedTags = entitiesUpdatedSince.tags;
            }

            cache.writeQuery({
              query: TAGS_QUERY,
              data: { tags: cachedTags },
            });
          }

          localStorage.setItem(
            ENTITIES_UPDATED_SINCE_STORAGE_KEY,
            entitiesUpdatedSince.timestamp
          );
        },
      }
    )
  );

  useEffect(() => {
    if (!isOnline) {
      return;
    }

    fetchEntitiesUpdatedSince({
      variables: {
        updatedSince: getUpdatedSince(),
      },
    });
  }, [fetchEntitiesUpdatedSince, isOnline]);

  useEffect(() => {
    if (entitiesUpdatedSince.state !== DataState.DATA || !isOnline) {
      return;
    }

    const notesRefetchInterval = setInterval(() => {
      entitiesUpdatedSince.refetch({
        updatedSince: getUpdatedSince(),
      });
    }, ENTITIES_UPDATED_SINCE_INTERVAL_MS);

    return () => {
      clearInterval(notesRefetchInterval);
    };
  }, [entitiesUpdatedSince, isOnline]);

  return entitiesUpdatedSince;
};

export default useEntitiesUpdatedSince;
