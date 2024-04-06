import { ApolloServer, ApolloServerPlugin } from '@apollo/server'
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import config from '@structure/config'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import mongoSanitize from 'express-mongo-sanitize'
import { createServer } from 'http'
import migrationSystem from './migrations/migrationSystem'
import { initializeMongo } from './mongo'
import restApi from './restApi.js'
import { resolvers, typeDefs } from './schema'
import { setUpGitHubLogin } from './users/githubLogin.js'
import { SessionContext } from './util/types'

const graphQlPath = '/graphql'

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
setUpGitHubLogin(app)

const runExpressServer = async () => {
  const apolloPlugins: Array<ApolloServerPlugin<SessionContext>> = [
    ApolloServerPluginLandingPageDisabled(),
  ]
  if (config.CHANNEL) {
    apolloPlugins.unshift(
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: {
          'request.credentials': 'same-origin',
        },
      }),
    )
    apolloPlugins.push({
      async requestDidStart(requestContext) {
        const start = new Date().getTime()

        return {
          async willSendResponse(responseContext) {
            const responseTime = new Date().getTime() - start
            const responseSize = (
              (JSON.stringify(responseContext.response).length * 2) /
              1024
            ).toFixed(1)
            console.log(
              `\x1b[33mApollo:\x1b[0m ${
                requestContext.operation?.operation || 'UNKNOWN'
              } ${requestContext.operationName || 'UNNAMED'} (${
                requestContext.contextValue.user?.name || 'ANONYMOUS'
              }) - ${
                responseContext.errors ? '\x1b[31mERROR' : '\x1b[32mOKAY'
              }\x1b[0m - \x1b[34m${responseSize}kB - ${responseTime}ms\x1b[0m`,
            )
          },
        }
      },
    })
  }

  // todo: basic protection against malicious queries (e.g. body length)
  const apolloServer = new ApolloServer<SessionContext>({
    typeDefs,
    resolvers,
    formatError: (formattedError) => {
      console.error(
        `[Apollo Error] ${formattedError.message} @ ${
          formattedError.path?.join('.') || 'NO PATH'
        }\n `,
        (formattedError.extensions.stacktrace as string[]).join('\n'),
      )
      return formattedError
    },
    plugins: apolloPlugins,
  })

  await apolloServer.start()

  app.use(
    graphQlPath,
    cors(corsOptions),
    bodyParser.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        return { user: (req as any).user }
      },
    }),
  )

  const server = createServer(app)

  restApi(app)

  await new Promise<void>((resolve) => server.listen(config.PORT, resolve))
  console.log(`REST Server running at http://localhost:${config.PORT}...`)
  console.log(
    `GraphQL Server running at http://localhost:${config.PORT}${graphQlPath}...`,
  )
}

await initializeMongo()

try {
  console.log('Running migrations...')
  await migrationSystem.migrateTo(8)
  console.log('Migrations complete.')
  await runExpressServer()
} catch (error) {
  console.error('Migration failed.')
  console.error(error)
  process.exit(1)
}
