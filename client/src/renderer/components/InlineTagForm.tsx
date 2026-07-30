import { Autocomplete, Stack, TextField, Typography } from '@mui/material'
import { matchSorter } from 'match-sorter'
import React, { useRef } from 'react'
import type { TagsQuery } from '../generated/graphql'
import useUserId from '../hooks/useUserId'
import { SkeletonTag } from './Skeletons'
import Tag from './Tag'

type TagType = TagsQuery['tags'][number]
type TagOrNewTagType = TagType | { newTagName: string; title: string }

type InlineTagFormProps = {
  tags: 'loading' | Array<TagType>
  onAddTag: (tagName: string) => void
  onAbort: (explicit?: boolean) => void
}

const MAX_TAG_SUGGESTIONS = 20
const TAG_OVERFLOW = 'TAG_OVERFLOW'

const getMatchingTags = (
  tags: Array<TagType>,
  inputValue: string,
): Array<TagType> =>
  matchSorter(tags, inputValue, {
    keys: [(tag) => tag.name.replace(/[:›>]/g, ' ')],
    baseSort: ({ item: tagA }, { item: tagB }) =>
      Math.sign(tagB.noteCount - tagA.noteCount),
  })

const InlineTagForm: React.FC<InlineTagFormProps> = ({
  onAddTag,
  onAbort,
  tags,
}) => {
  const userId = useUserId()
  const explicitlyHighlightedOptionRef = useRef<TagOrNewTagType | null>(null)

  return (
    <Autocomplete<TagOrNewTagType, false, false, true>
      open
      loading={tags === 'loading'}
      loadingText={
        <Stack gap={2}>
          <SkeletonTag />
          <SkeletonTag />
          <SkeletonTag />
          <SkeletonTag />
          <SkeletonTag />
        </Stack>
      }
      autoHighlight
      onChange={(_event, newValue) => {
        if (!newValue) {
          return
        }

        if (typeof newValue === 'string') {
          onAddTag(newValue)
          return
        }

        onAddTag('newTagName' in newValue ? newValue.newTagName : newValue.name)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          onAbort(true)
          return
        }
        if (
          event.key === 'Enter' &&
          explicitlyHighlightedOptionRef.current === null
        ) {
          const inputValue = (event.target as HTMLInputElement).value.trim()

          if (inputValue === '') {
            return
          }

          const matchingTags = getMatchingTags(
            tags === 'loading' ? [] : tags,
            inputValue,
          )

          if (matchingTags.length > 0) {
            event.preventDefault()
            ;(
              event as unknown as { defaultMuiPrevented?: boolean }
            ).defaultMuiPrevented = true
            onAddTag(matchingTags[0].name)
          }

          // the 'no match' scenario falls through to MUI's default (raw text) handling
        }
      }}
      onHighlightChange={(_event, option) => {
        explicitlyHighlightedOptionRef.current = option
      }}
      onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
        if (event.target.value.length === 0) {
          onAbort()
        }
      }}
      freeSolo
      filterOptions={(options, params) => {
        const { inputValue } = params

        explicitlyHighlightedOptionRef.current = null

        if (tags === 'loading') {
          // MUI only possibly shows the loading state when there is no data, so must not return "Add ..." either
          return []
        }

        let filtered: Array<TagOrNewTagType> = getMatchingTags(
          options as Array<TagType>,
          inputValue,
        )

        let hiddenCount = 0
        if (filtered.length > MAX_TAG_SUGGESTIONS) {
          hiddenCount = filtered.length - MAX_TAG_SUGGESTIONS
          filtered = filtered.slice(0, MAX_TAG_SUGGESTIONS)
        }

        // Suggest the creation of a new value
        const isExisting = options.some(
          (option) => inputValue === (option as TagType).name,
        )
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            newTagName: inputValue,
            title: `Add "${inputValue}"`,
          })
        }

        if (hiddenCount) {
          filtered.push({
            newTagName: TAG_OVERFLOW,
            title: `${hiddenCount} more matches, refine your search`,
          })
        }

        return filtered
      }}
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
          return option
        }

        return 'newTagName' in option ? option.newTagName : option.name
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label='Add tag'
          autoFocus
          size='small'
          style={{ width: '200px' }}
        />
      )}
      options={tags === 'loading' ? [] : tags}
      renderOption={(props, tag) => {
        let tagElement
        if ('newTagName' in tag) {
          if (tag.newTagName === TAG_OVERFLOW) {
            return (
              <li
                key={props.key}
                className={props.className}
                style={{ cursor: 'initial' }}
              >
                <Typography variant='caption' key={TAG_OVERFLOW}>
                  {tag.title}
                </Typography>
              </li>
            )
          } else {
            tagElement = (
              <>
                <div style={{ marginRight: '0.5em' }}>Create&nbsp;tag</div>
                <Tag
                  onClick={() => {}}
                  tag={{
                    _id: 'NEW_TAG',
                    name: tag.newTagName,
                    color: 'gray',
                    user: {
                      _id: userId,
                    },
                    permissions: [],
                  }}
                />
              </>
            )
          }
        } else {
          tagElement = <Tag onClick={() => {}} tag={tag} />
        }
        const { key, ...propsToPass } = props
        return (
          <li key={'_id' in tag ? tag._id : 'NEW_TAG'} {...propsToPass}>
            {tagElement}
          </li>
        )
      }}
    />
  )
}

export default InlineTagForm
