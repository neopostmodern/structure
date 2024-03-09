import { MigrationSystem } from '@structure/common'
import { Meta } from '../meta/metaModel'
import migrations from './migrations'

const migrationStorage = {
  async initialize() {
    await migrations.get(0).up()
    return (await Meta.findOne({ _id: 'database-version' })).value
  },
  async getVersion() {
    const databaseVersion = await Meta.findOne({ _id: 'database-version' })
    if (!databaseVersion) {
      return null;
    }
    return databaseVersion.value
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
