/**
 * Make any changes you need to make to the database here
 */
export async function up() {
  return this('Link').find()
    .then((links) =>
      Promise.all(links.map((link) => {
        // pre-save hook does some of the necessary work
        link.description = '';
        return link.save();
      }))
    );
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
export async function down() {
  return this('Link').updateMany({}, { $unset: { name: true, description: true } });
}
