import React from 'react'
import styled from 'styled-components'

import { BaseTag } from './Tag'
import colorTools, { ColorCache } from '../utils/colorTools'
import { TagObject } from '../reducers/links'

const autocompleteTagBorderColor = (tag, focused): string => {
  if (!focused) {
    return 'transparent'
  }

  return ColorCache[tag.color].isDark ? '#eee' : 'black'
}

const AutocompleteTag = styled(BaseTag)<{
  tag: TagObject
  autocompleteFocused: boolean
}>`
  border: 2px dotted
    ${({ tag, autocompleteFocused }): string =>
      autocompleteTagBorderColor(tag, autocompleteFocused)};
  margin-top: 0.5em;
  display: inline-block;
`

const AutocompleteTagMore = styled(AutocompleteTag)`
  background-color: white;
  font-weight: bold;
  padding-left: 0;
  padding-right: 0;
  margin-left: 0;
  margin-right: 0;

  cursor: initial;
`

const TagAutocompleteSuggestions: React.FC<{
  autocompleteSuggestions: Array<TagObject>
  focusedAutocompleteIndex: number
  onSelectTag: (tag: TagObject) => void
  maxSuggestionCount: number
}> = ({
  autocompleteSuggestions,
  focusedAutocompleteIndex,
  onSelectTag,
  maxSuggestionCount,
}) => (
  <>
    {autocompleteSuggestions
      .slice(0, maxSuggestionCount)
      .map((tag, tagIndex) => (
        <AutocompleteTag
          key={tag._id}
          tag={tag}
          autocompleteFocused={tagIndex === focusedAutocompleteIndex}
          onClick={(): void => {
            onSelectTag(tag)
          }}
          ref={colorTools}
        >
          {tag.name}
        </AutocompleteTag>
      ))}
    {autocompleteSuggestions.length > maxSuggestionCount ? (
      <AutocompleteTagMore key='more'>
        +{autocompleteSuggestions.length - maxSuggestionCount}
      </AutocompleteTagMore>
    ) : null}
  </>
)

export default TagAutocompleteSuggestions
