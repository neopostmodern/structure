import url from 'url';
import mongoose, { Schema } from 'mongoose';
import MigrateMongoose from 'migrate-mongoose';

// todo: environemnt!
const MONGO_URL = 'mongodb://localhost/structureApp';
mongoose.connect(MONGO_URL);

const userSchema = Schema({
  _id: String,
  name: String,
  createdAt: Date,
  authenticationProvider: String
});
const linkSchema = Schema({
  url: String,
  domain: String,
  path: String,
  name: String,
  description: { type: String, default: '' },
  createdAt: Date,
  user: { type: String, ref: 'User' },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag', index: true }]
});
linkSchema.pre('save', function (next) {
  const { hostname, pathname } = url.parse(this.url);
  if (typeof this.name === "undefined" || this.name.length === 0) {
    this.name = hostname + pathname;
  }
  this.domain = hostname;
  this.path = pathname;
  next();
});

const tagSchema = Schema({
  user: { type: String, ref: 'User' },
  name: String,
  color: String
});

export const User = mongoose.model('User', userSchema);
export const Tag  = mongoose.model('Tag', tagSchema);
export const Link = mongoose.model('Link', linkSchema);


let migrator = new MigrateMongoose({
  dbConnectionUri: MONGO_URL,
  es6Templates: true,
  autosync: true
});

migrator.list().then((migrations) => {
  console.log("Running migrations...");
  Promise.all(
    migrations.map((migration) => {
      if (migration.state === 'up') {
        console.log(`  ⇒ ${migration.name} already migrated`);
        return Promise.resolve();
      } else {
        console.log(`  ⇑ ${migration.name} will migrate 'up'...`);
        return migrator.run('up', migration.name)
          .then(() => console.log('    ...OK'))
          .catch((error) => console.error('    ...FAILED', error));
      }
    })
  )
    .then(() => console.log("Migrations complete."))
    .catch(() => console.error("Migration failed."))
});

// migrator.run('down', 'links-add-name-description')
