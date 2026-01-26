import { gql } from '@apollo/client'
import { useApolloClient, useLazyQuery } from '@apollo/client/react'
import { useEffect } from 'react'
import { TAGS_QUERY } from '../containers/TagsPage'
import type {
  EntitiesUpdatedSinceQuery,
  EntitiesUpdatedSinceQueryVariables,
} from '../generated/graphql'
import { cacheRefUpdater } from '../utils/cache'
import deferUntilIdle from '../utils/deferUntilIdle'
import logger from '../utils/logger'
import performanceMeasurements from '../utils/performanceMeasurements'
import {
  BASE_NOTE_FRAGMENT,
  BASE_TAG_FRAGMENT,
} from '../utils/sharedQueriesAndFragments'
import useDataState, { DataState } from '../utils/useDataState'
import useIsOnline from './useIsOnline'

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
`

const POPULATE_NOTES_CACHE_QUERY = gql`
  query PopulateNotesCacheQuery {
    notes {
      ...BaseNote

      tags {
        _id
      }
    }
  }
  ${BASE_NOTE_FRAGMENT}
`
const WRITE_NOTE_TO_CACHE_QUERY = gql`
  query WriteNoteToCacheQuery($noteId: String!) {
    note(noteId: $noteId) {
      ...BaseNote

      tags {
        _id
      }
    }
  }
  ${BASE_NOTE_FRAGMENT}
`
const WRITE_TAG_TO_CACHE_QUERY = gql`
  query WriteTagToCacheQuery($tagId: String!) {
    tag(tagId: $tagId) {
      ...BaseTag
    }
  }
  ${BASE_TAG_FRAGMENT}
`

export const ENTITIES_UPDATED_SINCE_CACHE_ID_STORAGE_KEY =
  'updatedSince-cacheId'
const getUpdatedSinceCacheId = () =>
  localStorage.getItem(ENTITIES_UPDATED_SINCE_CACHE_ID_STORAGE_KEY)
const ENTITIES_UPDATED_SINCE_INTERVAL_MS = 60 * 1000

const useEntitiesUpdatedSince = () => {
  logger.trace('[useEntitiesUpdatedSince] Hook start')
  const apolloClient = useApolloClient()
  const isOnline = useIsOnline()

  const [fetchEntitiesUpdatedSince, entitiesUpdatedSince] = useDataState(
    useLazyQuery<EntitiesUpdatedSinceQuery, EntitiesUpdatedSinceQueryVariables>(
      ENTITIES_UPDATED_SINCE_QUERY,
      {
        fetchPolicy: 'no-cache',
      },
    ),
  )

  useEffect(() => {
    /*
    This hook runs when data from the "entities updated since" query comes in.
    It syncs the data to the cache, quite manually.
    At the moment for performance reason it adds/updates individual entities
    first and then in a second step updates the list of entities.
     */
    performanceMeasurements.setReferencePoint(
      'useEntitiesUpdatedSince:useEffect',
    )
    if (entitiesUpdatedSince.state !== DataState.DATA) {
      return
    }

    const updatedEntities = entitiesUpdatedSince.data.entitiesUpdatedSince

    const { cache } = apolloClient
    const storedCacheId = getUpdatedSinceCacheId()

    logger.trace('[useEntitiesUpdatedSince] useEffect', {
      storedCacheId,
      updatedEntities,
      entitiesUpdatedSince,
    })

    if (!storedCacheId) {
      cache.writeQuery({
        query: POPULATE_NOTES_CACHE_QUERY,
        data: { notes: updatedEntities.addedNotes },
      })
      cache.writeQuery({
        query: TAGS_QUERY,
        data: { tags: updatedEntities.addedTags },
      })
    } else {
      ;[...updatedEntities.addedNotes, ...updatedEntities.updatedNotes].forEach(
        (note) => {
          cache.writeQuery({
            query: WRITE_NOTE_TO_CACHE_QUERY,
            data: { note },
            variables: { noteId: note._id },
          })
        },
      )
      ;[...updatedEntities.addedTags, ...updatedEntities.updatedTags].forEach(
        (tag) => {
          cache.writeQuery({
            query: WRITE_TAG_TO_CACHE_QUERY,
            data: { tag },
            variables: { tagId: tag._id },
          })
        },
      )

      // todo: actually remove entities from cache with removeEntityFromCache() ?

      cache.modify({
        id: 'ROOT_QUERY',
        fields: {
          notes: cacheRefUpdater(
            'Note',
            updatedEntities.addedNotes,
            updatedEntities.removedNoteIds,
          ),
          tags: cacheRefUpdater(
            'Tag',
            updatedEntities.addedTags,
            updatedEntities.removedTagIds,
          ),
        },
      })
    }

    localStorage.setItem(
      ENTITIES_UPDATED_SINCE_CACHE_ID_STORAGE_KEY,
      updatedEntities.cacheId,
    )
    performanceMeasurements.printMeasurement(
      'useEntitiesUpdatedSince:useEffect',
      '[useEntitiesUpdatedSince] useEffect (subprocess)',
    )
  }, [
    /*
    this check is weird, but the hook must not run again if the data itself
    didn't change and somehow the response object can change without the data
    changing (after it completed)
     */
    entitiesUpdatedSince.state === DataState.DATA && entitiesUpdatedSince.data,
  ])

  useEffect(() => {
    if (!isOnline) {
      return
    }

    const abortController = new AbortController()

    ;(async () => {
      await new Promise<void>((resolve) => deferUntilIdle(resolve, 5000))

      try {
        await fetchEntitiesUpdatedSince({
          variables: {
            cacheId: getUpdatedSinceCacheId(),
          },
          context: {
            fetchOptions: {
              signal: abortController.signal,
            },
          },
        })
      } catch (error) {
        logger.error(
          '[useEntitiesUpdatedSince.useEffect.fetchEntitiesUpdatedSince]',
          error,
        )
      }
    })()

    return () => abortController.abort()
  }, [fetchEntitiesUpdatedSince, isOnline])

  useEffect(() => {
    if (entitiesUpdatedSince.state !== DataState.DATA || !isOnline) {
      return
    }

    const notesRefetchInterval = setInterval(() => {
      entitiesUpdatedSince.refetch()
    }, ENTITIES_UPDATED_SINCE_INTERVAL_MS)

    return () => {
      clearInterval(notesRefetchInterval)
    }
  }, [entitiesUpdatedSince, isOnline])

  return entitiesUpdatedSince
}

export default useEntitiesUpdatedSince
