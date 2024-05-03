import { baseNotesQuery, leanTypeEnumFixer } from '../../notes/notesMethods'
import { Note } from '../../notes/notesModels'
import { Tag } from '../../tags/tagModel'
import { baseTagsQuery } from '../../tags/tagsMethods'
import { timerEnd, timerStart } from '../../util/logging'
import { Cache } from '../cacheModel'
import { cacheDiff } from './cacheDiff'
import { updateCacheFromDiff } from './updateCacheFromDiff'

export const entitiesUpdatedSince = async (cacheId, user) => {
  if (!user) {
    throw new Error('Need to be logged in to fetch links.')
  }

  timerStart('entitiesUpdatedSince')

  console.time('cache read')
  let cache = (await Cache.findOne({ _id: cacheId, user }).lean()) || {
    _id: undefined,
    value: {
      noteIds: [],
      tagIds: [],
    },
    updatedAt: new Date(0),
  }
  const cacheUpdatedAt = cache.updatedAt
  console.timeEnd('cache read')

  const entityQueryProjection = cache._id
    ? { _id: 1, updatedAt: 1, createdAt: 1, type: 1 }
    : {}

  const fetchNotes = async (transformFilters = (filter) => filter) => {
    if (cache._id) {
      console.log('direct notes read')
      return Note.collection
        .find(
          transformFilters({
            ...(await baseNotesQuery(user, 'read')),
            deletedAt: null,
          }),
        )
        .project(entityQueryProjection)
        .sort({ createdAt: -1 })
        .toArray()
        .then(leanTypeEnumFixer)
    }

    let notesLookup = Note.find(
      transformFilters({
        ...(await baseNotesQuery(user, 'read')),
        deletedAt: null,
      }),
    )
      .sort({ createdAt: -1 })
      .populate('tags')
      .lean()
    // .lean()

    // if (!cache._id) {
    //   notesLookup = notesLookup.populate('tags')
    // }

    return notesLookup.exec().then(leanTypeEnumFixer)
  }
  console.time('notes db call')
  const notes = await fetchNotes()
  console.timeEnd('notes db call')

  console.time('tag find')
  const tags = await Tag.find(
    {
      ...baseTagsQuery(user, 'read'),
    },
    entityQueryProjection,
  )
    .populate('user')
    .lean()
    .exec()
  console.timeEnd('tag find')

  // gets lost somewhere around here?

  console.time('notes diff')
  const notesDiff = cacheDiff(notes, cache.value.noteIds, {
    cacheUpdatedAt,
  })
  console.timeEnd('notes diff')
  console.time('tag diff')
  const tagsDiff = cacheDiff(tags, cache.value.tagIds, {
    cacheUpdatedAt,
  })
  console.timeEnd('tag diff')

  if (cache._id) {
    console.time('cache pre-processing (update)')
    if (tagsDiff.added.length) {
      tagsDiff.added = await Tag.find({
        _id: tagsDiff.added.map(({ _id }) => _id),
      })

      await Promise.all(
        tagsDiff.added.map(async (tag) => {
          // if a shared tag is added (appears for the first time) all notes on which it appears
          // must be treated as updated for other users (because it could have already been added
          // and then shared, which does not make notes with the tag 'updatedAt'!
          const newlySharedTagIds = []
          if (tag.user !== user._id) {
            newlySharedTagIds.push(tag._id)
          }
          if (newlySharedTagIds.length) {
            notesDiff.updated = notesDiff.updated.concat(
              (
                await fetchNotes((filter) => ({
                  ...filter,
                  tags: {
                    $in: filter.tags.$in.concat(newlySharedTagIds),
                  },
                }))
              ).map(({ _id }) => _id),
            )
          }
        }),
      )
    }
    if (tagsDiff.updated.length) {
      tagsDiff.updated = await Tag.find({
        _id: tagsDiff.updated.map(({ _id }) => _id),
      })
    }
    if (notesDiff.added.length) {
      notesDiff.added = await Note.find({
        _id: notesDiff.added.map(({ _id }) => _id),
      })
        .populate('tags')
        .lean()
    }
    if (notesDiff.updated.length) {
      notesDiff.updated = await Note.find({
        _id: notesDiff.updated.map(({ _id }) => _id),
      })
        .populate('tags')
        .lean()
    }
    console.timeEnd('cache pre-processing (update)')
  }

  let cacheIdWritten
  if (cache._id) {
    console.time('cache (update)')
    await updateCacheFromDiff(user, cache._id, 'noteIds', notesDiff)
    await updateCacheFromDiff(user, cache._id, 'tagIds', tagsDiff)

    await Cache.collection.updateOne(
      { _id: cache._id, user },
      {
        $set: {
          updatedAt: new Date(),
        },
      },
    )
    cacheIdWritten = cache._id
    console.timeEnd('cache (update)')
  } else {
    console.time('cache (pristine)')
    const cacheWriteValue = {
      noteIds: notesDiff.added.map(({ _id }) => _id),
      tagIds: tagsDiff.added.map(({ _id }) => _id),
    }
    const t_cache = new Date().getTime()
    cacheIdWritten = (await new Cache({ value: cacheWriteValue, user }).save())
      ._id
    console.log('cache (pristine)')
  }

  timerEnd('entitiesUpdatedSince', "Complete Method 'Entities Updated Since'")

  return {
    addedNotes: notesDiff.added,
    updatedNotes: notesDiff.updated,
    removedNoteIds: notesDiff.removedIds,
    addedTags: tagsDiff.added,
    updatedTags: tagsDiff.updated,
    removedTagIds: tagsDiff.removedIds,
    cacheId: cacheIdWritten,
  }
}
