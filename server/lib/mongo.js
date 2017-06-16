import url from 'url';
import mongoose, { Schema } from 'mongoose';
import MigrateMongoose from 'migrate-mongoose';

import config from './config.json';

mongoose.connect(config.MONGO_URL);

const userSchema = Schema({
  _id: String,
  name: String,
  createdAt: Date,
  authenticationProvider: String
});
export const User = mongoose.model('User', userSchema);

const noteOptions = { discriminatorKey: 'type' };
const noteSchema = Schema({
  name: String,
  description: { type: String, default: '' },
  createdAt: Date,
  user: { type: String, ref: 'User' },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag', index: true }],
}, noteOptions);
export const Note = mongoose.model('Note', noteSchema);


const textSchema = Schema({
}, noteOptions);
export const Text = Note.discriminator('Text', textSchema);

const linkSchema = Schema({
  url: String,
  domain: String,
  path: String,
}, noteOptions);
linkSchema.pre('save', function (next) {
  const { hostname, pathname } = url.parse(this.url);
  if (typeof this.name === 'undefined' || this.name.length === 0) {
    this.name = hostname + pathname;
  }
  this.domain = hostname;
  this.path = pathname;
  next();
});
export const Link = Note.discriminator('Link', linkSchema);

const tagSchema = Schema({
  user: { type: String, ref: 'User' },
  name: String,
  color: String
});
export const Tag = mongoose.model('Tag', tagSchema);


const migrationSystem = new MigrateMongoose({
  migrationsPath: config.MIGRATIONS_DIRECTORY,
  dbConnectionUri: config.MONGO_URL,
  es6Templates: true,
  autosync: true,
});

const forceRerunMigration = null; // 'note-types';

migrationSystem.list().then((migrations) => {
  console.log('Running migrations...');
  return Promise.all(
    migrations.map((migration) => {
      if (migration.state === 'up') {
        if (migration.name === forceRerunMigration) {
          console.log(`  ⇓ ${migration.name} forced migration 'down'...`);
          return migrationSystem.run('down', migration.name)
            .then(() => {
              console.log('    ...OK');
              return migration.name;
            })
            .catch((error) => console.error('    ...FAILED', error));
        } else {
          console.log(`  ⇒ ${migration.name} already migrated`);
          return Promise.resolve();
        }
      } else {
        return Promise.resolve(migration.name);
      }
    })
  ).then(migrationNames => Promise.all(
      migrationNames
        .filter(migrationName => Boolean(migrationName))
        .map(migrationName => {
          console.log(`  ⇑ ${migrationName} will migrate 'up'...`);
          return migrationSystem.run('up', migrationName)
            .then(() => console.log('    ...OK'))
            .catch((error) => console.error('    ...FAILED', error));
        })
  ));
})
  .then(() => console.log('Migrations complete.'))
  .catch(() => console.error('Migration failed.'));
