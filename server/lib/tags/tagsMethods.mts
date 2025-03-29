import { baseNotesQuery } from '../notes/notesMethods.mts'
import { Note } from '../notes/notesModels.mts'
import { Tag } from './tagModel.mts'

export const basePermissionsQueryOnTags = (user, resource, mode = 'read') => ({
  [`permissions.${user._id}.${resource}.${mode}`]: true,
})
export const baseTagsQuery = (user, mode = 'read') =>
  basePermissionsQueryOnTags(user, 'tag', mode)
export const MINIMAL_PERMISSIONS = {
  tag: {
    read: true,
    write: false,
    use: false,
    share: false,
  },
  notes: {
    read: true,
    write: false,
  },
}
export const ALL_PERMISSIONS = {
  tag: {
    read: true,
    write: true,
    use: true,
    share: true,
  },
  notes: {
    read: true,
    write: true,
  },
}
export const createTagObject = ({ name, color = 'lightgray', user }) => ({
  name,
  color,
  user,
  permissions: new Map([[user._id, ALL_PERMISSIONS]]),
})

export async function addTagByNameToNote(user, noteId, name) {
  let tag = await Tag.findOne({
    ...baseTagsQuery(user, 'use'),
    name,
  })
  if (!tag) {
    tag = await new Tag(createTagObject({ name, user })).save()
  }
  return Note.findOneAndUpdate(
    { _id: noteId },
    { $addToSet: { tags: tag._id } },
    { new: true }, // get the changed document after update
  ).lean()
}

export async function removeTagByIdFromNote(user, noteId, tagId) {
  const tag = await Tag.findOne(
    { _id: tagId, ...baseTagsQuery(user, 'use') },
    { permissions: 1 },
  ).lean()

  if (!tag) {
    throw Error('No such tag or no sufficient privileges')
  }

  const note = await Note.findOneAndUpdate(
    { _id: noteId, ...(await baseNotesQuery(user, 'write')) },
    { $pull: { tags: tagId } },
    { new: true }, // get the changed document after update
  ).lean()

  if (!note) {
    throw Error('No such note or no sufficient privileges')
  }
  return note
}
