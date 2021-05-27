import { Meta } from './mongo.js'
import migrations from './migrations.js'

async function migrateUp(version, migration) {
  console.log(`  ⇑ ${migration.name} (${version}) will migrate 'up'...`)
  await migration.up()

  const databaseVersion = await Meta.findOne({ _id: 'database-version' })
  databaseVersion.value = version
  databaseVersion.markModified('value')
  await databaseVersion.save()

  console.log(`    ...OK (database now at ${version})`)
}
async function migrateDown(version, migration) {
  console.log(`  ⇓ ${migration.name} (${version}) will migrate 'down'...`)
  await migration.up()

  const databaseVersion = await Meta.findOne({ _id: 'database-version' })
  databaseVersion.value = version - 1
  databaseVersion.markModified('value')
  await databaseVersion.save()

  console.log(`    ...OK (database now at ${version - 1})`)
}

export async function migrateTo(targetVersion) {
  let databaseVersion = await Meta.findOne({ _id: 'database-version' })

  if (databaseVersion === null) {
    console.log('Setting up migrations system...')
    await migrations.get(0).up()
    databaseVersion = await Meta.findOne({ _id: 'database-version' })
    console.log('  ...OK')
  }

  // todo: allow migrating down if necessary
  if (targetVersion < databaseVersion.value) {
    throw Error("Can't automatically migrate down.")
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const [version, migration] of migrations) {
    if (version > databaseVersion.value && version <= targetVersion) {
      // eslint-disable-next-line no-await-in-loop
      await migrateUp(version, migration)
    } else {
      console.log(`  ⇒ ${migration.name} already migrated`)
    }
  }
}

export async function rerunMigration(rerunVersion, withSubsequent = false) {
  const databaseVersion = await Meta.findOne({ _id: 'database-version' })
  const originalDatabaseVersion = databaseVersion.value

  if (rerunVersion > originalDatabaseVersion) {
    throw Error("Can't re-run a migration above current database version.")
  }

  // migrate down
  // eslint-disable-next-line no-restricted-syntax
  for (const [version, migration] of [...migrations].reverse()) {
    if (
      version === rerunVersion ||
      (withSubsequent &&
        version <= originalDatabaseVersion &&
        version > rerunVersion)
    ) {
      // eslint-disable-next-line no-await-in-loop
      await migrateDown(version, migration)
    }
  }

  // migrate up again
  // eslint-disable-next-line no-restricted-syntax
  for (const [version, migration] of migrations) {
    if (
      version === rerunVersion ||
      (withSubsequent &&
        version <= originalDatabaseVersion &&
        version > rerunVersion)
    ) {
      // eslint-disable-next-line no-await-in-loop
      await migrateUp(version, migration)
    }
  }
}
