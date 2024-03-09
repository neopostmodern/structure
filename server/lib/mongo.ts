import config from '@structure/config'
import mongoose from 'mongoose'
import { Cache } from './cache/cacheModel'

export const initializeMongo = async () => {
  await mongoose.connect(config.MONGO_URL)
  mongoose.set('debug', config.MONGOOSE_DEBUG)
  mongoose.set('strictQuery', 'throw')

  const clearOldCaches = async () => {
    console.log('Clearing old caches...')
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
