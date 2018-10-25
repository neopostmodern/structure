import mongoose, { Schema } from 'mongoose';

import config from './config';
import urlAnalyzer from '../../util/urlAnalyzer';

mongoose.connect(config.MONGO_URL);
mongoose.set('debug', config.MONGOOSE_DEBUG);

const metaSchema = Schema({
  _id: String,
  value: {}
});
export const Meta = mongoose.model('Meta', metaSchema);

const userSchema = Schema({
  _id: String,
  name: String,
  createdAt: Date,
  authenticationProvider: String,
  credentials: {
    type: {
      bookmarklet: {
        type: String,
        optional: true
      }
    },
    default: {}
  }
}, {
  minimize: false
});
export const User = mongoose.model('User', userSchema);

const noteOptions = { discriminatorKey: 'type' };
const noteSchema = Schema({
  name: String,
  description: { type: String, default: '' },
  createdAt: Date,
  user: { type: String, ref: 'User' },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag', index: true }],
  archivedAt: { type: Date, default: null },
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
  const { shortDomain, path, suggestedName } = urlAnalyzer(this.url);
  this.domain = shortDomain;
  this.path = path;
  if (typeof this.name === 'undefined' || this.name.length === 0) {
    this.name = suggestedName;
  }
  next();
});
export const Link = Note.discriminator('Link', linkSchema);

const tagSchema = Schema({
  user: { type: String, ref: 'User' },
  name: String,
  color: String
});
export const Tag = mongoose.model('Tag', tagSchema);
