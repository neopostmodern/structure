import express from 'express';
import bodyParser from 'body-parser';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { Feed } from 'feed';

import { User, Note, Link, Text, Tag } from './mongo';
import { setUpGitHubLogin } from './githubLogin';
import schema from './schema';

import config from './config';
import { addTagByNameToNote, submitLink } from './methods';
import { migrateTo } from './migrations';
import { rssFeedUrl } from '../../util/linkGenerator'

const corsAllowedOrigins = [
  undefined,
  'null',
  config.WEB_FRONTEND_HOST,
  config.ELECTRON_FRONTEND_HOST
];

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
        response.status(500).send('<html><body><h1>Structure error.</h1>Failed to save your link :(</body></html>');
      });
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
