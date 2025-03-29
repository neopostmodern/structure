import config from '@structure/config' with { type: 'json' }
import mongoose from 'mongoose'
import util from 'util'
import { Cache } from './cache/cacheModel.mts'
import { colors, logger } from './util/logging.mts'

export const initializeMongo = async () => {
  await mongoose.connect(config.MONGO_URL)
  if (config.MONGOOSE_DEBUG) {
    // mongoose.set('debug', true)
    mongoose.set('debug', (collectionName, methodName, ...methodArgs) =>
      logger.debug_raw(
        `${colors.cyan(
          '[Mongoose]',
        )} ${collectionName}.${methodName}(${methodArgs
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
