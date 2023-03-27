export interface MigrationStorage {
  initialize: () => Promise<number>
  getVersion: () => Promise<number | null>
  setVersion: (version: number) => Promise<void>
}

export interface Migration {
  name: string
  up: () => Promise<void>
  down: () => Promise<void>
}

export class MigrationSystem {
  private readonly _migrations: Map<number, Migration>
  private readonly _migrationStorage: MigrationStorage

  constructor({
    migrations,
    migrationStorage,
  }: {
    migrations: Map<number, Migration>
    migrationStorage: MigrationStorage
  }) {
    this._migrationStorage = migrationStorage
    this._migrations = migrations
  }

  private async _executeMigrationUp(version: number) {
    const migration = this._migrations.get(version)
    console.log(`  ⇑ ${migration.name} (${version}) will migrate 'up'...`)
    await migration.up()
    await this._migrationStorage.setVersion(version)
    console.log(`    ...OK (migration storage now at ${version})`)
  }
  private async _executeMigrationDown(version: number) {
    const migration = this._migrations.get(version)
    console.log(`  ⇓ ${migration.name} (${version}) will migrate 'down'...`)
    await migration.down()
    await this._migrationStorage.setVersion(version - 1)
    console.log(`    ...OK (migration storage now at ${version - 1})`)
  }

  async migrateTo(version: number) {
    let currentVersion = await this._migrationStorage.getVersion()

    if (currentVersion === null) {
      console.log('Setting up migrations system...')
      currentVersion = await this._migrationStorage.initialize()
      console.log('  ...OK')
    }

    // todo: allow migrating down if necessary
    if (version < currentVersion) {
      throw Error("Can't automatically migrate down.")
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const [migrationVersion, migration] of this._migrations) {
      if (
        migrationVersion > currentVersion &&
        migrationVersion <= migrationVersion
      ) {
        // eslint-disable-next-line no-await-in-loop
        await this._executeMigrationUp(migrationVersion)
      } else {
        console.log(`  ⇒ ${migration.name} already migrated`)
      }
    }
  }

  async rerunMigration(version, withSubsequent = false) {
    const originalDatabaseVersion = await this._migrationStorage.getVersion()

    if (version > originalDatabaseVersion) {
      throw Error("Can't re-run a migration above currently stored version.")
    }

    // migrate down
    // eslint-disable-next-line no-restricted-syntax
    for (const migrationVersion of [...this._migrations.keys()].reverse()) {
      if (
        migrationVersion === version ||
        (withSubsequent &&
          migrationVersion <= originalDatabaseVersion &&
          migrationVersion > migrationVersion)
      ) {
        // eslint-disable-next-line no-await-in-loop
        await this._executeMigrationDown(migrationVersion)
      }
    }

    // migrate up again
    // eslint-disable-next-line no-restricted-syntax
    for (const migrationVersion of this._migrations.keys()) {
      if (
        migrationVersion === version ||
        (withSubsequent &&
          migrationVersion <= originalDatabaseVersion &&
          migrationVersion > migrationVersion)
      ) {
        // eslint-disable-next-line no-await-in-loop
        await this._executeMigrationUp(migrationVersion)
      }
    }
  }
}

export default MigrationSystem
