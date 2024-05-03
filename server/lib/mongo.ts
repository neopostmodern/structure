import config from '@structure/config'
import mongoose from 'mongoose'
import util from 'util'
import { Cache } from './cache/cacheModel'
import { logger, colors } from './util/logging'

export const initializeMongo = async () => {
  await mongoose.connect(config.MONGO_URL)
  if (config.MONGOOSE_DEBUG) {
    // mongoose.set('debug', true)
    mongoose.set('debug', (collectionName, methodName, ...methodArgs) =>
      logger.debug_raw(
        `${colors.cyan("[Mongoose]")} ${collectionName}.${methodName}(${methodArgs
          .map((arg) => util.inspect(arg, { breakLength: Infinity }))
          .join(', ')})`,
      ),
    )
  }
  mongoose.set('strictQuery', 'throw')

  const clearOldCaches = async () => {
    logger.info('Clearing old caches...')
    await Cache.deleteMany({
      updatedAt: {
        $lt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      },
    })
  }

  // once a day delete cache entries that have not been updated for 30 days
  setInterval(clearOldCaches, 24 * 60 * 60 * 1000)
  // run once at startup
  setImmediate(clearOldCaches)
}
