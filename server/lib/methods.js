import crypto from 'crypto'
import { decode } from 'html-entities'
import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'
import { Cache, Link, Note, Tag, User } from './mongo.js'
import {
  baseNotesQuery,
  baseTagsQuery,
  cacheDiff,
  createTagObject,
  leanTypeEnumFixer,
} from './util.js'

export function submitLink(user, { url, title, description }) {
  return new Link({
    url,
    name: title,
    description,
    user,
    tags: [user.internal.ownershipTagId],
  }).save()
}

export async function addTagByNameToNote(user, noteId, name) {
  let tag = await Tag.findOne({
    ...baseTagsQuery(user, 'use'),
    name,
  })
  if (!tag) {
    tag = await new Tag(createTagObject({ name, user })).save()
  }
  return Note.findOneAndUpdate(
    { _id: noteId },
    { $addToSet: { tags: tag._id } },
    { new: true }, // get the changed document after update
  ).lean()
}

export async function removeTagByIdFromNote(user, noteId, tagId) {
  const tag = await Tag.findOne(
    { _id: tagId, ...baseTagsQuery(user, 'use') },
    { permissions: 1 },
  ).lean()

  if (!tag) {
    throw Error('No such tag or no sufficient privileges')
  }

  const note = await Note.findOneAndUpdate(
    { _id: noteId, ...(await baseNotesQuery(user, 'write')) },
    { $pull: { tags: tagId } },
    { new: true }, // get the changed document after update
  ).lean()

  if (!note) {
    throw Error('No such note or no sufficient privileges')
  }
  return note
}

export function requestNewCredential(userId, purpose) {
  return User.findOne({ _id: userId }).then((user) => {
    // eslint-disable-next-line no-param-reassign
    user.credentials[purpose] = crypto.randomBytes(10).toString('hex')

    user.markModified('credentials')

    return user.save()
  })
}

export function revokeCredential(userId, purpose) {
  return User.findOne({ _id: userId }).then((user) => {
    // eslint-disable-next-line no-param-reassign
    delete user.credentials[purpose]
    user.markModified('credentials')

    return user.save()
  })
}

export async function fetchTitleSuggestions(url) {
  return fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const dom = new JSDOM(html)
      const metaTitles = Array.from(
        dom.window.document.querySelectorAll('meta'),
      )
        .filter((meta) => {
          const name = meta.getAttribute('name')
          return name && name.includes('title')
        })
        .map((meta) => meta.content)

      const titleBag = [
        dom.window.document.querySelector('title').innerHTML,
        ...metaTitles,
      ].map((rawTitle) => decode(rawTitle).trim())

      return titleBag.filter(
        (title, index) => titleBag.indexOf(title) === index,
      ) // de-duplicate
    })
}

const updateCacheFromDiff = async (cacheId, cacheFieldName, diff) => {
  const cacheValueFieldName = `value.${cacheFieldName}`

  for (const patch of diff.patch) {
    if (patch.type === 'add') {
      await Cache.updateOne(
        { _id: cacheId },
        {
          $push: {
            [cacheValueFieldName]: {
              $each: patch.items.map(({ _id }) => _id),
              $position: patch.newPos,
            },
          },
        },
      )
    } else {
      // todo: could join all removes!
      await Cache.updateOne(
        { _id: cacheId },
        {
          $pull: {
            [cacheValueFieldName]: { $in: patch.items.map(({ _id }) => _id) },
          },
        },
      )
    }
  }
}

export const entitiesUpdatedSince = async (cacheId, user) => {
  if (!user) {
    throw new Error('Need to be logged in to fetch links.')
  }

  let cache = (await Cache.findById(cacheId).lean()) || {
    value: {
      noteIds: [],
      tagIds: [],
    },
    updatedAt: new Date(0),
  }
  const cacheUpdatedAt = cache.updatedAt

  const entityQueryProjection = cache._id ? { _id: 1, updatedAt: 1 } : {}

  const fetchNotes = async (transformFilters = (filter) => filter) => {
    let notesLookup = Note.find(
      transformFilters({
        ...(await baseNotesQuery(user, 'read')),
        deletedAt: null,
      }),
      entityQueryProjection,
    ).lean()

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
    await updateCacheFromDiff(cache._id, 'noteIds', notesDiff)
    await updateCacheFromDiff(cache._id, 'tagIds', tagsDiff)

    await Cache.collection.updateOne(
      { _id: cache._id },
      {
        $set: {
          updatedAt: new Date(),
        },
      },
    )
    cacheIdWritten = cache._id
  } else {
    const cacheWriteValue = {}
    cacheWriteValue.noteIds = notesDiff.added.map(({ _id }) => _id)
    cacheWriteValue.tagIds = tagsDiff.added.map(({ _id }) => _id)
    cacheIdWritten = (await new Cache({ value: cacheWriteValue }).save())._id
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
