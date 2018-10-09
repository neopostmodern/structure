import { User } from '../lib/mongo';

/**
 * Make any changes you need to make to the database here
 */
export async function up() {
  return User.find()
    .then((users) =>
      Promise.all(users.map((user) => {
        // pre-save hook should do the necessary work
        return user.save();
      }))
    );
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
export async function down() {
  return User.updateMany({}, { $unset: { credentials: true } });
}
