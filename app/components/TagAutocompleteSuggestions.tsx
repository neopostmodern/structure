import React from 'react'
import styled from 'styled-components'

import Tag from './Tag'
import { ColorCache } from '../utils/colorTools'

const autocompleteTagBorderColor = (tag, focused): string => {
  if (!focused) {
    return 'transparent'
  }

  return ColorCache[tag.color].isDark ? '#eee' : 'black'
}

const AutocompleteTag = styled(Tag)`
  border: 2px dotted
    ${({ tag, autocompleteFocus }): string =>
      autocompleteTagBorderColor(tag, autocompleteFocus)};
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

const TagAutocompleteSuggestions = ({
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
