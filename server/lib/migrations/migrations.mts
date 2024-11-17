import mongoose from 'mongoose'
import { Meta } from '../meta/metaModel.mts'
import { Link, Note, Text } from '../notes/notesModels.mts'
import { Tag } from '../tags/tagModel.mts'
import { ALL_PERMISSIONS } from '../tags/tagsMethods.mts'
import { User } from '../users/userModel.mts'

import { createOwnershipTagOnUser } from '../users/methods/createOwnershipTagOnUser.mts'
import { logger } from '../util/logging.mts'

const migrations = new Map()
migrations.set(0, {
  name: 'change-migrations-system',
  async up() {
    const highestMigration = await mongoose.connection.db
      .collection('migrations')
      .findOne({ state: 'up' }, { sort: { createdAt: -1 } })
    logger.info('Detected highest previously run migration:', highestMigration)
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
    logger.info(`Database version set to ${highestVersion}`)
    logger.info(
      "Obsolete 'migrations' collection not deleted, you can do so manually.",
    )
    return migrationMetaEntry.save()
  },
  async down() {
    logger.warn('This migration is irreversible. Performing no action.')
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
    const collectionNames = await mongoose.connection.db
      .listCollections({ name: 'links' })
      .toArray()

    if (collectionNames.length) {
      const linkCollection = mongoose.connection.db.collection('links')
      await linkCollection.updateMany({}, { $set: { type: 'Link' } })
      await linkCollection.rename('notes')
    }
  },
  async down() {
    return Text.deleteMany({})
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

const collectionsToAddUpdatedAtField = [Meta, User, Note, Tag]
migrations.set(6, {
  name: 'create-field-updated-at',
  async up() {
    logger.info(
      "[Migration 6.1] Ensure the (previously missing) 'createdAt' field exists on all users...",
    )
    await User.find().then((users) =>
      Promise.all(
        users.map(async (user) => {
          if (user.createdAt) {
            return
          }
          logger.info(`Setting best-guess 'createdAt' for user ${user._id}...`)
          let oldestNoteCreatedAt = (
            await Note.findOne(
              { user: user._id },
              { createdAt: 1 },
              {
                sort: { createdAt: 1 },
              },
            )
          )?.createdAt
          if (!oldestNoteCreatedAt) {
            logger.warn('User has no notes, using current time.')
            oldestNoteCreatedAt = new Date()
          }
          user.createdAt = oldestNoteCreatedAt
          return user.save({ timestamps: false })
        }),
      ),
    )
    logger.info('[Migration 6.1] OK\n')

    logger.info(
      "[Migration 6.2] Ensure the (previously missing) 'createdAt' field exists on all tags...",
    )
    await Tag.updateMany(
      {},
      [
        {
          $set: {
            createdAt: {
              $toDate: '$_id',
            },
          },
        },
      ],
      { timestamps: false },
    )
    logger.info('[Migration 6.2] OK\n')

    logger.info(
      "[Migration 6.3] Ensure the (previously missing) 'createdAt' field exists on meta collection...",
    )
    const oldestUserCreatedAt =
      (
        await User.findOne(
          {},
          { createdAt: 1 },
          {
            sort: { createdAt: 1 },
          },
        )
      )?.createdAt || new Date()
    await Meta.updateMany(
      {},
      {
        $set: {
          createdAt: oldestUserCreatedAt,
        },
      },
      { timestamps: false },
    )
    logger.info('[Migration 6.3] OK\n')

    logger.info("[Migration 6.4] Create field 'updatedAt' throughout...")
    for (const collection of collectionsToAddUpdatedAtField) {
      await collection.updateMany(
        {},
        [
          {
            $set: {
              updatedAt: '$createdAt',
            },
          },
        ],
        { timestamps: false },
      )
    }
    logger.info('[Migration 6.4] OK\n')
  },
  async down() {
    logger.info("[Migration 6.1] Delete 'createdAt' on user...")
    await User.updateMany(
      {},
      { $unset: { createdAt: true } },
      { timestamps: false },
    )
    logger.info('[Migration 6.1] OK\n')

    logger.info("[Migration 6.2] Delete 'createdAt' on tag...")
    await Tag.updateMany(
      {},
      { $unset: { createdAt: true } },
      { timestamps: false },
    )
    logger.info('[Migration 6.2] OK\n')

    logger.info("[Migration 6.3] Delete 'createdAt' on meta collection...")
    await Meta.updateMany(
      {},
      { $unset: { createdAt: true } },
      { timestamps: false },
    )
    logger.info('[Migration 6.3] OK\n')

    logger.info("[Migration 6.4] Delete field 'updatedAt' throughout...")
    for (const collection of collectionsToAddUpdatedAtField) {
      await collection.updateMany(
        {},
        {
          $unset: {
            updatedAt: true,
          },
        },
        { timestamps: false },
      )
    }
    logger.info('[Migration 6.4] OK\n')
  },
})

migrations.set(7, {
  name: 'permissions-on-tags',
  async up() {
    for (const user of await User.find()) {
      await Tag.updateMany(
        { user },
        { $set: { permissions: new Map([[user._id, ALL_PERMISSIONS]]) } },
        { timestamps: false },
      )

      const userWithOwnershipTag = await createOwnershipTagOnUser(user)

      await Note.updateMany(
        { user },
        { $push: { tags: userWithOwnershipTag.internal.ownershipTagId } },
        { timestamps: false },
      )
    }
  },
  async down() {
    await Tag.updateMany({}, { $unset: { permissions: true } })
    for (const user of await User.find()) {
      if (!user.internal?.ownershipTagId) {
        continue
      }
      await Note.updateMany(
        { tags: user.internal.ownershipTagId },
        { $pull: { tags: user.internal.ownershipTagId } },
      )
      await Tag.findByIdAndDelete(user.internal.ownershipTagId)
    }
    await User.updateMany({}, { $unset: { internal: true } })
  },
})

migrations.set(8, {
  name: 'changed-at',
  async up() {
    for (const note of await Note.find()) {
      note.changedAt = note.updatedAt
      await note.save()
    }
    for (const tag of await Tag.find()) {
      tag.changedAt = tag.updatedAt
      await tag.save()
    }
  },
  async down() {
    await Note.updateMany({}, { $unset: { changedAt: 1 } })
    await Tag.updateMany({}, { $unset: { changedAt: 1 } })
  },
})

export default migrations
