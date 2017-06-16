import mongoose from 'mongoose';

/**
 * Make any changes you need to make to the database here
 */
export async function up() {
  const linkCollection = mongoose.connection.db.collection('links');
  return linkCollection.updateMany({}, { $set: { type: 'Link' } })
    .then(() => linkCollection.rename('notes'));
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
export async function down() {
  return this('Text').find().remove()
    .then(() => mongoose.connection.db.collection('notes').rename('links'))
    .then(() => this('Link').updateMany({}, { $unset: { type: true } }));
}
