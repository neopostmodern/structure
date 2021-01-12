import crypto from 'crypto';

import { User, Note, Link, Text, Tag } from './mongo.js';

export function submitLink(user, url) {
  return new Link({
    url,
    user,
    createdAt: new Date()
  }).save();
}

export function addTagByNameToNote(user, noteId, name) {
  return Tag.findOne({ name, user }).then((tag) => {
    if (tag) {
      return tag;
    }
    return new Tag({ name, color: 'lightgray', user }).save();
  }).then((tag) => (
    Note.findOneAndUpdate(
      { _id: noteId },
      { $addToSet: { tags: tag._id } }
    )
      .exec()
  ));
}

export function requestNewCredential(userId, purpose) {
  return User.findOne({ _id: userId })
    .then(user => {
      // eslint-disable-next-line no-param-reassign
      user.credentials[purpose] = crypto
        .randomBytes(10)
        .toString('hex');

      user.markModified('credentials');

      return user.save();
    });
}

export function revokeCredential(userId, purpose) {
  return User.findOne({ _id: userId })
    .then(user => {
      // eslint-disable-next-line no-param-reassign
      delete user.credentials[purpose];
      user.markModified('credentials');

      return user.save();
    });
}
