import crypto from 'crypto'
import { decode } from 'html-entities'
import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'
import { Link, Note, Tag, User } from './mongo.js'

export function submitLink(user, url) {
  return new Link({
    url,
    user,
  }).save()
}

export function addTagByNameToNote(user, noteId, name) {
  return Tag.findOne({ name, user })
    .then((tag) => {
      if (tag) {
        return tag
      }
      return new Tag({ name, color: 'lightgray', user }).save()
    })
    .then((tag) =>
      Note.findOneAndUpdate(
        { _id: noteId },
        { $addToSet: { tags: tag._id } },
      ).exec(),
    )
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
      ].map((rawTitle) => decode(rawTitle))

      return titleBag.filter(
        (title, index) => titleBag.indexOf(title) === index,
      ) // de-duplicate
    })
}
