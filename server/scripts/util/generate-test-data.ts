import { initializeMongo } from '../../lib/mongo.mts'
import { User } from '../../lib/users/userModel.mts'
import { Text } from '../../lib/notes/notesModels.mts'
import { Tag } from '../../lib/tags/tagModel.mts'
import { createTagObject } from '../../lib/tags/tagsMethods.mts'
import { readFileSync } from 'fs'

const TAG_COUNT = 2_000
const NOTE_COUNT = 10_000

const isms = readFileSync('../../../resources/isms.txt', 'utf8').split('\n')

const colors = [
  'blue',
  'red',
  'green',
  'navy',
  'purple',
  'darkgoldenrod',
  'darkgreen',
  'lightblue',
  'brown',
  'cyan',
]

const getRandomWord = () => isms[Math.floor(Math.random() * isms.length)]
const getRandomColor = () => {
  if (Math.random() < 0.8) {
    return 'lightgray'
  }

  return colors[Math.floor(Math.random() * colors.length)]
}

// take the first argument as the username
const username = process.argv[2]

if (!username) {
  console.error('Please provide the username')
  process.exit(1)
}

console.log('Connecting to database...')
// wait for mongo startup
await initializeMongo()
console.log('OK')

const user = await User.findOne({ name: username })

if (!user) {
  console.error(`No such user: ${username}`)
  process.exit(1)
}

console.log(user)

const tags = []
for (let tagIndex = 0; tagIndex < TAG_COUNT; tagIndex++) {
  const tagData = createTagObject({
    name: `${getRandomWord()} #${tagIndex + 1}`,
    color: getRandomColor(),
    user,
  })
  tags.push(await new Tag(tagData).save())
}

const getRandomTagIds = () => {
  const tagCount = Math.floor(Math.pow(Math.random(), 3) * 5)

  const randomTagIds = []

  for (let randomTagIndex = 0; randomTagIndex < tagCount; randomTagIndex++) {
    const randomTagId =
      tags[Math.floor(Math.pow(Math.random(), 10) * tags.length)]._id

    if (randomTagIds.includes(randomTagId)) {
      continue
    }

    randomTagIds.push(randomTagId)
  }

  return randomTagIds
}

let tagAssociationsCount = 0

for (let noteIndex = 0; noteIndex < NOTE_COUNT; noteIndex++) {
  let description = ''

  if (Math.random() < 0.1) {
    const descriptionWordCount = Math.floor(Math.random() * 50)
    for (
      let descriptionWordIndex = 0;
      descriptionWordIndex < descriptionWordCount;
      descriptionWordIndex++
    ) {
      description += getRandomWord() + (Math.random() < 0.1 ? '\n\n' : ' ')
    }
  }

  const randomTagIds = getRandomTagIds()
  tagAssociationsCount += randomTagIds.length

  await new Text({
    name: `${getRandomWord()} ${getRandomWord()} ${getRandomWord()} #${noteIndex + 1}`,
    description,
    user,
    tags: [user.internal.ownershipTagId, ...randomTagIds],
  }).save()
}

console.log(
  `Inserted ${TAG_COUNT} tags, ${NOTE_COUNT} notes and ${tagAssociationsCount} tag associations to notes.`,
)
process.exit(0)
