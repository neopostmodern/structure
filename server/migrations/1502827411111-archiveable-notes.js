/**
 * Make any changes you need to make to the database here
 */
export async function up() {
  return this('Note').find()
    .then((notes) =>
      Promise.all(notes.map((note) => {
        // eslint-disable-next-line no-param-reassign
        note.archivedAt = null;
        return note.save();
      }))
    );
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
export async function down() {
  return this('Note').updateMany({}, { $unset: { archived: true } });
}
