import React from 'react';
import styled from 'styled-components';
import { TagObject } from '../reducers/links';
import { ColorCache } from '../utils/colorTools';
import Tag from './Tag';

const AutocompleteTagMore = styled.div`
  font-weight: bold;
`;

const TagAutocompleteSuggestions: React.FC<{
  autocompleteSuggestions: Array<TagObject>;
  focusedAutocompleteIndex: number | null;
  onSelectTag: (tag: TagObject) => void;
  maxSuggestionCount: number;
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
        <Tag
          key={tag._id}
          tag={tag}
          sx={{
            border: `2px dotted transparent`,
            borderColor:
              tagIndex === focusedAutocompleteIndex
                ? ColorCache[tag.color].isDark
                  ? '#eee'
                  : 'black'
                : undefined,
            marginRight: 1,
            marginBottom: 1,
          }}
          onClick={(): void => {
            onSelectTag(tag);
          }}
        />
      ))}
    {autocompleteSuggestions.length > maxSuggestionCount ? (
      <AutocompleteTagMore key="more">
        +{autocompleteSuggestions.length - maxSuggestionCount}
      </AutocompleteTagMore>
    ) : null}
  </>
);

export default TagAutocompleteSuggestions;
