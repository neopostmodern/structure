import express from 'express';
import bodyParser from 'body-parser';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { User, Note, Link, Text, Tag } from './mongo';
import { setUpGitHubLogin } from './githubLogin';
import schema from './schema';

import config from './config';
import { addTagByNameToNote, submitLink } from './methods';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(mongoSanitize());
app.use(cors({ origin: 'http://localhost:1212', credentials: true }));
setUpGitHubLogin(app, User);

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

app.get('/bookmarklet', (request, result) => {
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
      result.send(
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
      request.status(500).send('<html><body><h1>Structure error.</h1>Failed to save your link :(</body></html>');
    });
});

app.listen(config.PORT, () => {
  console.log(`Structure GraphQL Server running at ${config.PORT}...`);
});
