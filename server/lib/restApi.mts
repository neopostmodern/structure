import { rssFeedUrl } from '@structure/common'
import config from '@structure/config'
import { Feed } from 'feed'
import _ from 'lodash'
import { submitLink } from './notes/notesMethods.mts'
import { Link, Note } from './notes/notesModels.mts'
import { Tag } from './tags/tagModel.mts'
import { addTagByNameToNote } from './tags/tagsMethods.mts'
import { User } from './users/userModel.mts'
import { logger } from './util/logging.mts'
import { Meta } from './meta/metaModel.mts';

const restApi = (app) => {
  app.get('/', (request, response) => {
    response.send(`
<!doctype html>
<html lang='en'>
<head>
<title>Structure backend</title>
<style>
body {
  width: 20em;
  margin: 5em auto;
  font-family: "Lunchtype22", "Nimbus Sans", "Helvetica", "Arial", sans-serif;
}
</style>
</head>
<body>
<pre>
 ▗▄▄▖▗▄▄▄▖▗▄▄▖ ▗▖ ▗▖ ▗▄▄▖▗▄▄▄▖▗▖ ▗▖▗▄▄▖ ▗▄▄▄▖
▐▌     █  ▐▌ ▐▌▐▌ ▐▌▐▌     █  ▐▌ ▐▌▐▌ ▐▌▐▌   
 ▝▀▚▖  █  ▐▛▀▚▖▐▌ ▐▌▐▌     █  ▐▌ ▐▌▐▛▀▚▖▐▛▀▀▘
▗▄▄▞▘  █  ▐▌ ▐▌▝▚▄▞▘▝▚▄▄▖  █  ▝▚▄▞▘▐▌ ▐▌▐▙▄▄▖


</pre>
<p>
  This is the backend server. Learn more about Structure on <a href='https://structure.love'>its website</a>.
</p>
<p>
  Are you looking for <a href="${config.WEB_FRONTEND_HOST}">the webapp</a>?
</p>
</body>
</html>`)
  })
  app.get('/bookmarklet', (request, response) => {
    const { token, url } = request.query
    User.findOne({ 'credentials.bookmarklet': token })
      .then((user) => {
        if (!user) {
          throw Error('No user with provided credential (token) found.')
        }
        return submitLink(user, url).then(({ _id }) =>
          addTagByNameToNote(user, _id, 'from:bookmarklet'),
        )
      })
      .then(() =>
        response.send(
          `
<html>
<body>
  <h1>Added to Structure!</h1>
  You can close this window, if it doesn't do so itself.
  <script>setTimeout(function () { window.close(); }, 3000);</script>
</body>
</html>`,
        ),
      )
      .catch((error) => {
        logger.error('Bookmarklet URL insert failed!', error)
        response
          .status(500)
          .send(
            '<!DOCTYPE html><html lang="en"><body><h1>Structure error.</h1>Failed to save your link :(</body></html>',
          )
      })
  })

  app.get('/desktop/add', (request, response) => {
    const { url } = request.query

    response.send(
      `
<html>
<body>
  <h1>Adding to Structure...</h1>
  Structure should open now.<br/>
  The first time this window appears you might have to configure your browser to open Structure.<br />
  You can close this window, if it doesn't do so itself.<br />
  <button type="button" onclick="localStorage.setItem('auto-close-desktop-add', 'true')">
    Automatically close in the future.
  </button>
  <script>
    window.location = 'structure:///notes/add?url=${url}&autoSubmit';
    if (localStorage.getItem('auto-close-desktop-add')) {
      setTimeout(function () { window.close(); }, 100);
    }
  </script>
</body>
</html>`,
    )
  })

  app.get('/rss', (request, response) => {
    const { token } = request.query
    User.findOne({ 'credentials.rss': token })
      .then((user) => {
        if (!user) {
          throw Error('No feed with provided credential (token) found.')
        }

        const feed = new Feed({
          title: `Structure - ${user.name}`,
          description: `Automatically generated Structure-feed of all links by ${user.name}`,
          id: 'http://example.com/',
          link: rssFeedUrl(config.BACKEND_URL, user.credentials.rss),
          favicon: `${config.BACKEND_URL}/favicon.ico`,
          copyright: `Rights possibly reserved by ${user.name}`,
          author: {
            name: user.name,
            link: `https://github.com/${user.name}`,
          },
        })

        return Link.find({ user })
          .sort({ createdAt: -1 })
          .limit(10)
          .exec()
          .then((links) => {
            links.forEach((link) => {
              feed.addItem({
                title: link.name,
                guid: link._id.toString(),
                guidIsPermaLink: false,
                link: link.url,
                description: link.description,
                date: link.createdAt,
              })
            })
          })
          .then(() => {
            response.set('Content-Type', 'application/rss+xml')
            response.status(200).send(feed.rss2())
          })
      })
      .catch((error) => {
        logger.error('Generating RSS feed failed!', error)
        response
          .status(500)
          .send(
            '<html><body><h1>Structure error.</h1>Failed to generate your RSS feed :(</body></html>',
          )
      })
  })

  app.get('/export.json', async (request, response) => {
    const { user } = request
    if (!user) {
      response.status(400).send({
        error: `Must be logged in to export! Please go to ${config.WEB_FRONTEND_HOST} to sign in.`,
      })
      return
    }

    const tags = await Tag.find({ user: user._id }).lean()
    const notes = await Note.find({ user: user._id }).lean()
    for (const tag of tags) {
      delete (tag as any).__v
    }
    for (const note of notes) {
      delete (note as any).__v
    }
    const allData = {
      user: _.pick(user, [
        '_id',
        'name',
        'authenticationProvider',
        'createdAt',
        'updatedAt',
      ]),
      tags,
      notes,
      meta: { exportedAt: new Date(), exportedFrom: config.BACKEND_URL },
    }
    response.send(allData)
  })

  app.use('/hello', async (request, response) => {
    try {
      await Meta.updateOne(
        { _id: 'heartbeat' },
        { $set: { timestamp: new Date().toISOString() } },
        { upsert: true }
      )

      response.status(200).send('OK')
    } catch (error) {
      console.error(`/hello - Failed to write heartbeat to database!`)
      console.error(error);

      response.status(500).send('Database error.')
    }
  })
}

export default restApi
