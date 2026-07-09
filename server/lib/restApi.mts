import config from '@structure/config'
import _ from 'lodash'
import { Meta } from './meta/metaModel.mts'
import { Note } from './notes/notesModels.mts'
import { Tag } from './tags/tagModel.mts'

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
        { upsert: true },
      )

      response.status(200).send('OK')
    } catch (error) {
      console.error(`/hello - Failed to write heartbeat to database!`)
      console.error(error)

      response.status(500).send('Database error.')
    }
  })
}

export default restApi
