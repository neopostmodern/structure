import config from '@structure/config'
import { Feed } from 'feed'
import { Note } from './notesModels.mts'

// no RSS feed (anymore), code is kept for a future unauthenticated per-tag RSS feed
export async function buildUserRssFeed(user) {
  const feed = new Feed({
    title: `Structure - ${user.name}`,
    description: `Automatically generated Structure-feed of all links by ${user.name}`,
    id: 'http://example.com/',
    link: config.BACKEND_URL,
    favicon: `${config.BACKEND_URL}/favicon.ico`,
    copyright: `Rights possibly reserved by ${user.name}`,
    author: {
      name: user.name,
      link: `https://github.com/${user.name}`,
    },
  })

  const notes = await Note.find({ user })
    .sort({ createdAt: -1 })
    .limit(10)
    .exec()

  notes.forEach((note) => {
    feed.addItem({
      title: note.name,
      guid: note._id.toString(),
      guidIsPermaLink: false,
      link: note.url,
      description: note.description,
      date: note.createdAt,
    })
  })

  return feed.rss2()
}
