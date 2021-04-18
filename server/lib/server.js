import express from 'express';
import bodyParser from 'body-parser';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import GraphQLServerExpress from 'graphql-server-express';
import feed from 'feed';

import { User, Note, Link, Text, Tag } from './mongo.js';
import { setUpGitHubLogin } from './githubLogin.js';
import schema from './schema.js';

import config from './config.js';
import { addTagByNameToNote, submitLink } from './methods.js';
import { migrateTo } from './migrations.js';
import { rssFeedUrl } from '../../util/linkGenerator.js'

// named import isn't working at the moment
const { graphqlExpress, graphiqlExpress } = GraphQLServerExpress;
const { Feed } = feed;

let corsAllowedOrigins = [
  undefined,
  'null',
  config.WEB_FRONTEND_HOST,
  config.ELECTRON_FRONTEND_HOST
];
if (process.env.NODE_ENV === 'development') {
  // allow access to GraphiQL in development
  corsAllowedOrigins.push(config.BACKEND_URL)
}

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(mongoSanitize());
app.use(cors({
  origin(origin, callback) {
    if (corsAllowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Host disallowed by CORS: ${origin}`));
    }
  },
  credentials: true
}));
setUpGitHubLogin(app, User);

const runExpressServer = () => {
  app.use('/graphql', graphqlExpress((req) => {
    // Get the query, the same way express-graphql does it
    // https://github.com/graphql/express-graphql/blob/3fa6e68582d6d933d37fa9e841da5d2aa39261cd/src/index.js#L257
    const query = req.query.query || req.body.query;
    if (query && query.length > 2000) {
      // None of our app's queries are this long
      // Probably indicates someone trying to send an overly expensive query
      throw new Error('Query too large.');
    }

    return {
      schema,
      context: {
        user: req.user,
        Tag,
        Note,
        Link,
        Text,
      },
    };
  }));

  if (config.GRAPHIQL) {
    app.use('/graphiql', graphiqlExpress({
      endpointURL: '/graphql',
      query: `# Structure Example Query
{
  notes(limit: 5, offset: 0) {
    ... on INote {
      _id
      name
      tags {
        name
      }
    }
    ... on Link {
      url
    }
  }
}
    `,
    }));
  }

  app.get('/bookmarklet', (request, response) => {
    const { token, url } = request.query;
    User.findOne({ 'credentials.bookmarklet': token })
      .then(user => {
        if (!user) {
          throw Error('No user with provided credential (token) found.');
        }
        return submitLink(user, url)
          .then(({ _id }) => addTagByNameToNote(user, _id, 'from:bookmarklet'));
      })
      .then(() => (
        response.send(
          `
<html>
<body>
  <h1>Added to Structure!</h1>
  You can close this window, if it doesn't do so itself.
  <script>setTimeout(function () { window.close(); }, 3000);</script>
</body>
</html>`
        )
      ))
      .catch((error) => {
        console.error('Bookmarklet URL insert failed!', error);
        response.status(500).send('<!DOCTYPE html><html lang="en"><body><h1>Structure error.</h1>Failed to save your link :(</body></html>');
      });
  });

  app.get('/desktop/add', (request, response) => {
    const { url } = request.query;

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
</html>`
    )
  });

  app.get('/rss', (request, response) => {
    const { token } = request.query;
    User.findOne({ 'credentials.rss': token })
      .then(user => {
        if (!user) {
          throw Error('No feed with provided credential (token) found.');
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
            link: `https://github.com/${user.name}`
          }
        });

        return Link.find({ user })
          .sort({ createdAt: -1 })
          .limit(10)
          .exec()
          .then((links) => {
            links.forEach(link => {
              feed.addItem({
                title: link.name,
                guid: link._id.toString(),
                guidIsPermaLink: false,
                link: link.url,
                description: link.description,
                date: link.createdAt
              });
            });
          })
          .then(() => {
            response.set('Content-Type', 'application/rss+xml');
            response
              .status(200)
              .send(feed.rss2());
          });
      })
      .catch((error) => {
        console.error('Generating RSS feed failed!', error);
        response.status(500).send('<html><body><h1>Structure error.</h1>Failed to generate your RSS feed :(</body></html>');
      });
  });

  app.use('/hello', (request, response) => {
    response.status(200).send('OK');
  });

  app.listen(config.PORT, () => {
    console.log(`Structure GraphQL Server running at ${config.PORT}...`);
  });
};

console.log('Running migrations...');
migrateTo(5)
  .then(() => {
    console.log('Migrations complete.');
    runExpressServer();
  })
  .catch((error) => {
    console.error('Migration failed.');
    console.error(error);
    process.exit(1);
  });
