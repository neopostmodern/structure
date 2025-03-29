import { decode } from 'html-entities'
import { JSDOM } from 'jsdom'
import { Types } from 'mongoose'
import fetch from 'node-fetch'
import { Tag } from '../tags/tagModel.mts'
import { basePermissionsQueryOnTags } from '../tags/tagsMethods.mts'
import { Link } from './notesModels.mts'

const { ObjectId } = Types

export function submitLink(user, { url, title, description }) {
  return new Link({
    url,
    name: title,
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

export const leanTypeEnumFixer = (notes) =>
  notes.map((note) => ({ ...note, type: note.type.toUpperCase() }))
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
