import { baseNotesQuery, leanTypeEnumFixer } from '../../notes/notesMethods'
import { Note } from '../../notes/notesModels'
import { Tag } from '../../tags/tagModel'
import { baseTagsQuery } from '../../tags/tagsMethods'
import { Cache } from '../cacheModel'
import { cacheDiff } from './cacheDiff'
import { updateCacheFromDiff } from './updateCacheFromDiff'

export const entitiesUpdatedSince = async (cacheId, user) => {
  if (!user) {
    throw new Error('Need to be logged in to fetch links.')
  }

  let cache = (await Cache.findOne({ _id: cacheId, user }).lean()) || {
    _id: undefined,
    value: {
      noteIds: [],
      tagIds: [],
    },
    updatedAt: new Date(0),
  }
  const cacheUpdatedAt = cache.updatedAt

  const entityQueryProjection = cache._id
    ? { _id: 1, updatedAt: 1, createdAt: 1 }
    : {}

  const fetchNotes = async (transformFilters = (filter) => filter) => {
    let notesLookup = Note.find(
      transformFilters({
        ...(await baseNotesQuery(user, 'read')),
        deletedAt: null,
      }),
      entityQueryProjection,
    )
      .sort({ createdAt: -1 })
      .lean()

    if (!cache._id) {
      notesLookup = notesLookup.populate('tags')
    }

    return notesLookup.exec().then(leanTypeEnumFixer)
  }
  const notes = await fetchNotes()

  const tags = await Tag.find(
    {
      ...baseTagsQuery(user, 'read'),
    },
    entityQueryProjection,
  )
    .lean()
    .exec()

  const notesDiff = cacheDiff(notes, cache.value.noteIds, {
    cacheUpdatedAt,
  })
  const tagsDiff = cacheDiff(tags, cache.value.tagIds, {
    cacheUpdatedAt,
  })

  if (cache._id) {
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
  }

  let cacheIdWritten
  if (cache._id) {
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
  } else {
    const cacheWriteValue = {
      noteIds: notesDiff.added.map(({ _id }) => _id),
      tagIds: tagsDiff.added.map(({ _id }) => _id),
    }
    cacheIdWritten = (await new Cache({ value: cacheWriteValue, user }).save())
      ._id
  }

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
