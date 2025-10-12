import { ApolloServer, type ApolloServerPlugin } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled'
import config from '@structure/config'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import type { Request, Response, NextFunction } from 'express'
import mongoSanitize from 'express-mongo-sanitize'
import { createServer } from 'http'
import migrationSystem from './migrations/migrationSystem.mts'
import { initializeMongo } from './mongo.mts'
import restApi from './restApi.mts'
import { resolvers, typeDefs } from './schema.mts'
import { setUpGitHubLogin } from './users/githubLogin.mts'
import { logger, timerEnd, timerStart } from './util/logging.mts'
import type { SessionContext } from './util/types.mts'

timerStart('startup')

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
// todo: this is just a hack to bypass https://github.com/fiznool/express-mongo-sanitize/issues/202
app.use((request: Request, response: Response, next: NextFunction) => {
  Object.defineProperty(request, 'query', {
    ...Object.getOwnPropertyDescriptor(request, 'query'),
    value: request.query,
    writable: true,
  })

  next()
})
app.use(mongoSanitize())
app.use(cors(corsOptions))
setUpGitHubLogin(app)

const runExpressServer = async () => {
  const apolloPlugins: Array<ApolloServerPlugin<SessionContext>> = [
    ApolloServerPluginLandingPageDisabled(),
  ]
  if (config.CHANNEL) {
    // todo: find replacement
    // apolloPlugins.unshift(
    //   ApolloServerPluginLandingPageGraphQLPlayground({
    //     settings: {
    //       'request.credentials': 'same-origin',
    //     },
    //   }),
    // )
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
            logger.debug_raw(
              `\x1b[33m[Apollo]\x1b[0m ${
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
      logger.error(
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
  logger.info(`REST Server running at http://localhost:${config.PORT}...`)
  logger.info(
    `GraphQL Server running at http://localhost:${config.PORT}${graphQlPath}...`,
  )
  timerEnd('startup', 'Server startup')
}

await initializeMongo()

try {
  logger.info('Running migrations...')
  await migrationSystem.migrateTo(8)
  logger.info('Migrations complete.')
  await runExpressServer()
} catch (error) {
  logger.info('Migration failed.')
  logger.error(error)
  process.exit(1)
}
