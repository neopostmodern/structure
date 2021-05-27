import mongoose from 'mongoose'
import { Meta, User, Link, Note } from './mongo.js'

const migrations = new Map()
migrations.set(0, {
  name: 'change-migrations-system',
  async up() {
    const highestMigration = await mongoose.connection.db
      .collection('migrations')
      .findOne({ state: 'up' }, { sort: { createdAt: -1 } })
    console.log('Detected highest previously run migration:')
    console.log(highestMigration)
    let highestVersion = 0
    if (highestMigration !== null) {
      migrations.forEach((migration, version) => {
        if (migration.name === highestMigration.name) {
          highestVersion = version
        }
      })
    }

    const migrationMetaEntry = new Meta({
      _id: 'database-version',
      value: highestVersion,
    })
    console.log(`Database version set to ${highestVersion}`)
    console.log(
      "Obsolete 'migrations' collection not deleted, you can do so manually.",
    )
    return migrationMetaEntry.save()
  },
  async down() {
    console.log('This migration is irreversible. Performing no action.')
  },
})
migrations.set(1, {
  name: 'links-add-domain',
  async up() {
    return Link.find().then((links) =>
      Promise.all(links.map((link) => link.save())),
    )
  },
  async down() {
    return Link.updateMany({}, { $unset: { domain: true, path: true } })
  },
})
migrations.set(2, {
  name: 'links-add-name-description',
  async up() {
    return Link.find().then((links) =>
      Promise.all(
        links.map((link) => {
          // pre-save hook does some of the necessary work
          // eslint-disable-next-line no-param-reassign
          link.description = ''
          return link.save()
        }),
      ),
    )
  },
  async down() {
    return Link.updateMany({}, { $unset: { name: true, description: true } })
  },
})
migrations.set(3, {
  name: 'note-types',
  async up() {
    mongoose.connection.db
      .listCollections({ name: 'links' })
      .toArray((error, collectionNames) => {
        if (error) {
          throw error
        }

        if (collectionNames) {
          const linkCollection = mongoose.connection.db.collection('links')
          return linkCollection
            .updateMany({}, { $set: { type: 'Link' } })
            .then(() => linkCollection.rename('notes'))
        }
      })
  },
  async down() {
    return Text.find()
      .remove()
      .then(() => mongoose.connection.db.collection('notes').rename('links'))
      .then(() => Link.updateMany({}, { $unset: { type: true } }))
  },
})
migrations.set(4, {
  name: 'archiveable-notes',
  async up() {
    return Note.find().then((notes) =>
      Promise.all(
        notes.map((note) => {
          // eslint-disable-next-line no-param-reassign
          note.archivedAt = null
          return note.save()
        }),
      ),
    )
  },
  async down() {
    return Note.updateMany({}, { $unset: { archived: true } })
  },
})
migrations.set(5, {
  name: 'credentials',
  async up() {
    return User.find().then((users) =>
      Promise.all(users.map((user) => user.save())),
    )
  },
  async down() {
    return User.updateMany({}, { $unset: { credentials: true } })
  },
})

export default migrations
