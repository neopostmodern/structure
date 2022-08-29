import config from '@structure/config'
import { ApolloServer } from 'apollo-server-express'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import mongoSanitize from 'express-mongo-sanitize'
import { createServer } from 'http'
import { setUpGitHubLogin } from './githubLogin.js'
import { migrateTo } from './migrationSystem.js'
import { User } from './mongo.js'
import { resolvers, typeDefs } from './resolvers.js'
import restApi from './restApi.js'

let corsAllowedOrigins = [
  undefined,
  'null',
  config.BACKEND_URL,
  config.WEB_FRONTEND_HOST,
  ...config.ADDITIONAL_FRONTEND_HOSTS,
]
if (process.env.NODE_ENV === 'development') {
  // allow access to GraphiQL in development
  corsAllowedOrigins.push(config.BACKEND_URL)
}
const corsOptions = {
  origin(origin, callback) {
    if (corsAllowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`Host disallowed by CORS: ${origin}`))
    }
  },
  credentials: true,
}

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(mongoSanitize())
app.use(cors(corsOptions))
setUpGitHubLogin(app, User)

const runExpressServer = async () => {
  // todo: basic protection against malicious queries (e.g. body length)
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req: { user } }) => {
      return { user }
    },
    playground: {
      settings: {
        'request.credentials': 'same-origin',
      },
    },
  })

  apolloServer.applyMiddleware({ app, cors: corsOptions })

  const server = createServer(app)

  restApi(app)

  await new Promise((resolve) => server.listen(config.PORT, resolve))
  console.log(`REST Server running at http://localhost:${config.PORT}...`)
  console.log(
    `GraphQL Server running at http://localhost:${config.PORT}${apolloServer.graphqlPath}...`,
  )
}

console.log('Running migrations...')
migrateTo(6)
  .then(() => {
    console.log('Migrations complete.')
    runExpressServer()
  })
  .catch((error) => {
    console.error('Migration failed.')
    console.error(error)
    process.exit(1)
  })
