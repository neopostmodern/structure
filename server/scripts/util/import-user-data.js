import { INTERNAL_TAG_PREFIX_OWNERSHIP } from '@structure/common'
import { ObjectId } from 'bson'
import * as fs from 'fs'
import * as readline from 'readline'
import { Cache, Note, Tag, User } from '../../lib/mongo.js'

// print with red font
const red = (text) => `\x1b[31m${text}\x1b[0m`

const convertData = ({ _id, createdAt, updatedAt, ...rest }) => {
  let permissions
  if (rest.permissions) {
    permissions = Object.keys(rest.permissions).reduce(
      (permissionsObject, key) => ({
        ...permissionsObject,
        [key]: {
          ...rest.permissions[key],
          _id: ObjectId.createFromHexString(rest.permissions[key]._id),
        },
      }),
      {},
    )
  }
  return {
    ...rest,
    permissions,
    tags: rest.tags
      ? rest.tags.map((tag) => ObjectId.createFromHexString(tag))
      : undefined,
    _id: ObjectId.createFromHexString(_id),
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
    archivedAt: rest.archivedAt ? new Date(rest.archivedAt) : undefined,
  }
}

// wait for mongo startup
await new Promise((resolve) => setTimeout(resolve, 1000))

// take the first argument as the file name
const backupFileName = process.argv[2]

// check if the file name is provided
if (!backupFileName) {
  console.error('Please provide the file name')
  process.exit(1)
}

// check if the file exists
if (!fs.existsSync(backupFileName)) {
  console.error('File does not exist')
  process.exit(1)
}

// read the file as json
const backupData = JSON.parse(fs.readFileSync(backupFileName, 'utf8'))

// check if the file is valid
if (!backupData || !backupData.notes || !backupData.notes.length) {
  console.error('Invalid file')
  process.exit(1)
}

// import data
const user = User.findOne({ name: backupData.user.name })
if (!user) {
  // todo: user creation, but below
  console.error('User not found')
  process.exit(1)
}

const existingNotesCount = await Note.find({
  user: backupData.user._id,
}).countDocuments()
const existingTagsCount = await Tag.find({
  user: backupData.user._id,
}).countDocuments()
const existingData = existingNotesCount || existingTagsCount

// confirm whether user wants to import data
console.log(`
Importing data:
∙ from server ${backupData.meta.exportedFrom}
∙ file ${backupFileName} 
∙ exported at ${backupData.meta.exportedAt}
∙ for user '${backupData.user.name}' 
∙ contains ${backupData.notes.length} notes 
∙ and ${backupData.tags.length} tags
`)
if (existingData) {
  console.log(
    red(
      `Will delete ${existingNotesCount} existing notes and ${existingTagsCount} existing tags!`,
    ) + '\n',
  )
}

// read user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const confirmation = await new Promise((resolve) =>
  rl.question('Do you want to continue? [y/N] ', resolve),
)
if (confirmation.toLowerCase() !== 'y') {
  console.log('Aborted')
  process.exit(0)
}

if (existingData) {
  console.log('Deleting existing data...')
  await Note.deleteMany({ user: backupData.user._id })
  await Tag.deleteMany({ user: backupData.user._id })
}

console.log('Importing data...')
await Tag.collection.insertMany(backupData.tags.map(convertData))
await Note.collection.insertMany(backupData.notes.map(convertData))

console.log('Updating user...')
const ownershipTagId = backupData.tags.find((tag) =>
  tag.name.startsWith(INTERNAL_TAG_PREFIX_OWNERSHIP),
)._id
await User.updateOne(
  { _id: backupData.user._id },
  {
    $set: {
      'internal.ownershipTagId': ObjectId.createFromHexString(ownershipTagId),
    },
  },
  { timestamps: false },
)

console.log("Dumping user's caches...")
await Cache.deleteMany({ user: backupData.user._id })

console.log('Done, import completed.')
process.exit(0)
