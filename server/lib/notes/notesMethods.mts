import { decode } from 'html-entities'
import { JSDOM } from 'jsdom'
import Moment from 'moment/moment.js'
import { Types } from 'mongoose'
import fetch from 'node-fetch'
import { Tag } from '../tags/tagModel.mts'
import { basePermissionsQueryOnTags } from '../tags/tagsMethods.mts'
import { Note } from './notesModels.mts'

const { ObjectId } = Types

export function createNote(
  user,
  {
    url,
    title,
    description,
  }: { url?: string; title?: string; description?: string },
) {
  let prefilledTitle: string = title
  if (!title && !url) {
    prefilledTitle = Moment().format('dddd, MMMM Do YYYY')
  }
  return new Note({
    url,
    name: prefilledTitle,
    description,
    user,
    tags: [user.internal.ownershipTagId],
  }).save()
}

export async function fetchTitleSuggestions(url: string) {
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

export const baseNotesQuery = async (user, mode = 'read') => {
  const tagIdsWithNoteReadPermissionAndSharing = await Tag.aggregate([
    {
      $match: {
        ...basePermissionsQueryOnTags(user, 'notes', mode),
      },
    },
    {
      $match: {
        $expr: {
          $gte: [{ $size: { $objectToArray: '$permissions' } }, 2],
        },
      },
    },
    {
      $project: {
        _id: 1,
      },
    },
  ])

  return {
    tags: {
      $in: [
        new ObjectId(user.internal.ownershipTagId),
        ...tagIdsWithNoteReadPermissionAndSharing.map(({ _id }) => _id),
      ],
    },
  }
}
