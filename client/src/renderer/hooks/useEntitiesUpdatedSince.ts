import {
  gql,
  StoreObject,
  useApolloClient,
  useLazyQuery,
} from '@apollo/client';
import { useEffect } from 'react';
import { NOTES_QUERY } from '../containers/NotesPage/NotesPage';
import { TAGS_QUERY } from '../containers/TagsPage';
import type {
  EntitiesUpdatedSinceQuery,
  EntitiesUpdatedSinceQueryVariables,
  NotesForListQuery,
  TagsQuery,
  TagWithNoteIdsQuery,
  TagWithNoteIdsQueryVariables,
} from '../generated/graphql';
import { removeEntityFromCache } from '../utils/cache';
import {
  BASE_NOTE_FRAGMENT,
  BASE_TAG_FRAGMENT,
} from '../utils/sharedQueriesAndFragments';
import useDataState, { DataState } from '../utils/useDataState';
import useIsOnline from './useIsOnline';

export const ENTITIES_UPDATED_SINCE_QUERY = gql`
  query EntitiesUpdatedSince($cacheId: ID) {
    entitiesUpdatedSince(cacheId: $cacheId) {
      addedNotes {
        ...BaseNote
      }
      updatedNotes {
        ...BaseNote
      }
      removedNoteIds

      addedTags {
        ...BaseTag
      }
      updatedTags {
        ...BaseTag
      }
      removedTagIds

      cacheId
    }
  }
  ${BASE_NOTE_FRAGMENT}
  ${BASE_TAG_FRAGMENT}
`;

const UPDATED_NOTES_CACHE_QUERY = gql`
  query UpdatedNotesCacheQuery {
    notes {
      ...BaseNote

      ... on INote {
        tags {
          _id
        }
      }
    }
  }
  ${BASE_NOTE_FRAGMENT}
`;

export const ENTITIES_UPDATED_SINCE_CACHE_ID_STORAGE_KEY =
  'updatedSince-cacheId';
const getUpdatedSinceCacheId = () =>
  localStorage.getItem(ENTITIES_UPDATED_SINCE_CACHE_ID_STORAGE_KEY);
const ENTITIES_UPDATED_SINCE_INTERVAL_MS = 60 * 1000;

const mergeNewlyCreatedIntoCache = <EntityType extends StoreObject>(
  cachedEntities: Array<EntityType>,
  newEntity: EntityType,
) => {
  // by default insert at the end, but if note exists, override
  let noteIndexToUpdate = cachedEntities.findIndex(
    (noteInCache) => noteInCache._id === newEntity._id,
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
        fetchPolicy: 'no-cache',
        onCompleted({ entitiesUpdatedSince }) {
          const { cache } = apolloClient;
          const storedCacheId = getUpdatedSinceCacheId();

          if (!storedCacheId) {
            cache.writeQuery({
              query: NOTES_QUERY,
              data: { notes: [] },
            });
            cache.writeQuery({
              query: TAGS_QUERY,
              data: { tags: [] },
            });
          }

          if (
            entitiesUpdatedSince.addedNotes.length ||
            entitiesUpdatedSince.removedNoteIds.length
          ) {
            const notesCacheValue = cache.readQuery<NotesForListQuery>({
              query: UPDATED_NOTES_CACHE_QUERY,
            });

            let cachedNotes: NotesForListQuery['notes'];

            if (storedCacheId) {
              if (!notesCacheValue) {
                throw Error(
                  '[NotesPage: ENTITIES_UPDATED_SINCE_QUERY.onCompleted] Failed to read cache for notes.',
                );
              }

              cachedNotes = notesCacheValue.notes.slice();

              entitiesUpdatedSince.addedNotes.forEach((note) => {
                mergeNewlyCreatedIntoCache(cachedNotes, note);
              });
              if (entitiesUpdatedSince.removedNoteIds.length) {
                cachedNotes = cachedNotes.filter(
                  ({ _id }) =>
                    !entitiesUpdatedSince.removedNoteIds.includes(_id),
                );
              }
            } else {
              cachedNotes = entitiesUpdatedSince.addedNotes;
            }

            cache.writeQuery({
              query: UPDATED_NOTES_CACHE_QUERY,
              data: { notes: cachedNotes },
            });
          }

          if (
            entitiesUpdatedSince.addedTags.length ||
            entitiesUpdatedSince.removedTagIds.length
          ) {
            const tagsCacheValue = cache.readQuery<TagsQuery>({
              query: TAGS_QUERY,
            });

            let cachedTags: TagsQuery['tags'];

            if (storedCacheId) {
              if (!tagsCacheValue) {
                throw Error(
                  '[NotesPage: ENTITIES_UPDATED_SINCE_QUERY.onCompleted] Failed to read cache for tags.',
                );
              }

              cachedTags = tagsCacheValue.tags.slice();

              entitiesUpdatedSince.addedTags.forEach((tag) => {
                mergeNewlyCreatedIntoCache(cachedTags, tag);
              });

              if (entitiesUpdatedSince.removedTagIds.length) {
                entitiesUpdatedSince.removedTagIds.forEach((tagId) => {
                  const tagQuery = cache.readQuery<
                    TagWithNoteIdsQuery,
                    TagWithNoteIdsQueryVariables
                  >({
                    query: gql`
                      query TagWithNoteIds($tagId: ID!) {
                        tag(tagId: $tagId) {
                          _id
                          notes {
                            ... on INote {
                              _id
                            }
                          }
                        }
                      }
                    `,
                    variables: { tagId },
                  });
                  if (!tagQuery?.tag) {
                    return;
                  }
                  const { tag } = tagQuery;
                  tag.notes?.forEach((note) => {
                    cache.modify({
                      id: cache.identify(note!),
                      fields: {
                        tags(currentTagsOnNote: Array<{ __ref: string }> = []) {
                          return currentTagsOnNote.filter(
                            ({ __ref }) => __ref.split(':')[1] !== tagId,
                          );
                        },
                      },
                    });
                  });
                  removeEntityFromCache(cache, tag);
                });
                cachedTags = cachedTags.filter(
                  ({ _id }) =>
                    !entitiesUpdatedSince.removedTagIds.includes(_id),
                );
              }
            } else {
              cachedTags = entitiesUpdatedSince.addedTags;
            }

            cache.writeQuery({
              query: TAGS_QUERY,
              data: { tags: cachedTags },
            });
          }

          localStorage.setItem(
            ENTITIES_UPDATED_SINCE_CACHE_ID_STORAGE_KEY,
            entitiesUpdatedSince.cacheId,
          );
        },
      },
    ),
  );

  useEffect(() => {
    if (!isOnline) {
      return;
    }

    (async () => {
      try {
        await fetchEntitiesUpdatedSince({
          variables: {
            cacheId: getUpdatedSinceCacheId(),
          },
        });
      } catch (error) {
        console.error(
          '[useEntitiesUpdatedSince.useEffect.fetchEntitiesUpdatedSince]',
          error,
        );
      }
    })();
  }, [fetchEntitiesUpdatedSince, isOnline]);

  useEffect(() => {
    if (entitiesUpdatedSince.state !== DataState.DATA || !isOnline) {
      return;
    }

    const notesRefetchInterval = setInterval(() => {
      entitiesUpdatedSince.refetch();
    }, ENTITIES_UPDATED_SINCE_INTERVAL_MS);

    return () => {
      clearInterval(notesRefetchInterval);
    };
  }, [entitiesUpdatedSince, isOnline]);

  return entitiesUpdatedSince;
};

export default useEntitiesUpdatedSince;
