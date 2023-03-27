import { MigrationSystem } from '@structure/common'
import migrations from './migrations.js'
import { Meta } from './mongo.js'

const migrationStorage = {
  async initializeStorage() {
    await migrations.get(0).up()
    return (await Meta.findOne({ _id: 'database-version' })).value
  },
  async getVersion() {
    return (await Meta.findOne({ _id: 'database-version' })).value
  },
  async setVersion(version) {
    const databaseVersion = await Meta.findOne({ _id: 'database-version' })
    databaseVersion.value = version
    databaseVersion.markModified('value')
    await databaseVersion.save()
  },
}

export default new MigrationSystem({
  migrations,
  migrationStorage,
})
