import { MigrationStorage, MigrationSystem } from '@structure/common'
import { migrations } from './migrations'

const MIGRATION_VERSION_STORAGE_KEY = 'migrationVersion'

export const getMigrationStorageVersionSync = (): number | null => {
  let version = parseInt(
    localStorage.getItem(MIGRATION_VERSION_STORAGE_KEY) || '',
  )
  if (Number.isNaN(version)) {
    return null
  }
  return version
}

const migrationStorage: MigrationStorage = {
  async initialize() {
    this.setVersion(0)
    return this.getVersion()
  },
  async getVersion() {
    return getMigrationStorageVersionSync()
  },
  async setVersion(version: number) {
    localStorage.setItem(MIGRATION_VERSION_STORAGE_KEY, version.toString())
  },
}

export default new MigrationSystem({
  migrations,
  migrationStorage,
})
