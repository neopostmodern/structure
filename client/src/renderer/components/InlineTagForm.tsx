import { Paper } from '@mui/material';
import React, {
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { TagsQuery_tags } from '../generated/TagsQuery';
import { TextField } from './CommonStyles';
import TagAutocompleteSuggestions from './TagAutocompleteSuggestions';

const AutocompleteSuggestionsContainer = styled(Paper)`
  position: absolute;
  z-index: 1;
  left: -0.5em;
  padding: 0.5em;
  width: calc(100% + 1em);
`;

type InlineTagFormProps = {
  tags: 'loading' | Array<TagsQuery_tags>;
  onAddTag: (tagName: string) => void;
  onAbort: () => void;
};

type TagMap = { [tagId: string]: TagsQuery_tags };

const MAX_AUTOCOMPLETE_LENGTH = 5;
const INLINE_TAG_FORM_ID = 'inline-tag-form';

const InlineTagForm: React.FC<InlineTagFormProps> = ({
  onAddTag,
  onAbort,
  tags,
}) => {
  const { handleSubmit, register, formState, watch } = useForm();
  const nameValue = watch('tagName');
  const [focusedAutocompleteIndex, setFocusedAutocompleteIndex] = useState<
    number | null
  >(0);
  const [touched, setTouched] = useState(false);

  const tagMap = useMemo<TagMap>(() => {
    if (tags === 'loading') {
      return {};
    }
    const nextTagMap: TagMap = {};
    tags.forEach((tag) => {
      nextTagMap[tag._id] = tag;
    });
    return nextTagMap;
  }, [tags]);

  const autocompleteSuggestions = useMemo<TagsQuery_tags[]>(() => {
    if (tags === 'loading') {
      return [];
    }

    if (!nameValue) {
      return tags;
    }

    return tags
      .map(({ _id, name }) => ({
        _id,
        index: name.toLowerCase().indexOf(nameValue.toLowerCase()),
        name,
      }))
      .filter(({ index }) => index !== -1)
      .sort(
        (tag1, tag2) =>
          tag1.index +
          tag1.name.length / 100 -
          (tag2.index + tag2.name.length / 100)
      )
      .map(({ _id }) => tagMap[_id]);
  }, [nameValue, tags]);

  const lastAutocompleteSuggestionsLength = useRef<number>(
    autocompleteSuggestions.length
  );

  useEffect(() => {
    if (focusedAutocompleteIndex !== null) {
      if (autocompleteSuggestions.length === 0) {
        setFocusedAutocompleteIndex(null);
      } else if (focusedAutocompleteIndex > autocompleteSuggestions.length) {
        setFocusedAutocompleteIndex(autocompleteSuggestions.length - 1);
      }
    } else if (
      lastAutocompleteSuggestionsLength.current === 0 &&
      autocompleteSuggestions.length > 0
    ) {
      setFocusedAutocompleteIndex(0);
    }
    lastAutocompleteSuggestionsLength.current = autocompleteSuggestions.length;
  }, [autocompleteSuggestions, focusedAutocompleteIndex]);

  const handleInputKeydown = (event: KeyboardEvent<HTMLElement>): void => {
    let nextFocusedAutocompleteIndex: number | null = focusedAutocompleteIndex;
    switch (event.key) {
      case 'Escape':
        onAbort();
        return;
      case 'Enter':
        // if either shift key is pressed or the input field itself is focused, let default input
        // field behavior kick in (instead of using suggestion)
        if (!event.shiftKey && focusedAutocompleteIndex !== null) {
          onAddTag(autocompleteSuggestions[focusedAutocompleteIndex].name);
        }
        return;
      case 'ArrowDown':
        if (focusedAutocompleteIndex === null) {
          nextFocusedAutocompleteIndex = 0;
        } else {
          nextFocusedAutocompleteIndex = focusedAutocompleteIndex + 1;
        }
        break;
      case 'ArrowUp':
        if (focusedAutocompleteIndex === null) {
          nextFocusedAutocompleteIndex = MAX_AUTOCOMPLETE_LENGTH - 1;
        } else {
          nextFocusedAutocompleteIndex = focusedAutocompleteIndex - 1;
        }
        break;
      case 'ArrowLeft':
        if (focusedAutocompleteIndex !== null) {
          nextFocusedAutocompleteIndex = focusedAutocompleteIndex - 1;
        }
        break;
      case 'ArrowRight':
        if (focusedAutocompleteIndex !== null) {
          nextFocusedAutocompleteIndex = focusedAutocompleteIndex + 1;
        }
        break;
      default:
        break;
    }

    if (
      nextFocusedAutocompleteIndex !== null &&
      (nextFocusedAutocompleteIndex < 0 ||
        nextFocusedAutocompleteIndex >=
          Math.min(MAX_AUTOCOMPLETE_LENGTH, autocompleteSuggestions.length))
    ) {
      nextFocusedAutocompleteIndex = null;
    }
    if (nextFocusedAutocompleteIndex !== focusedAutocompleteIndex) {
      setFocusedAutocompleteIndex(nextFocusedAutocompleteIndex);
      event.preventDefault();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(({ tagName }) => onAddTag(tagName))}
      style={{ position: 'relative' }}
      id={INLINE_TAG_FORM_ID}
    >
      {formState.errors.tagName && (
        <div
          style={{
            color: 'darkred',
            position: 'absolute',
            bottom: '100%',
            right: 0,
            fontSize: '70%',
          }}
        >
          {formState.errors.tagName.message}
        </div>
      )}
      <TextField
        {...register('tagName', { required: 'no empty tags' })}
        placeholder="tag name"
        type="text"
        form={INLINE_TAG_FORM_ID}
        onKeyDown={handleInputKeydown}
        autoFocus
        style={
          focusedAutocompleteIndex === null
            ? { borderBottomStyle: 'dotted', borderBottomWidth: '2px' }
            : { marginBottom: '1px' }
        }
        onFocus={(): void => {
          setTouched(true);
        }}
      />

      {touched && (
        <AutocompleteSuggestionsContainer>
          {tags === 'loading' ? (
            <>Tags loading...</>
          ) : (
            <TagAutocompleteSuggestions
              autocompleteSuggestions={autocompleteSuggestions}
              focusedAutocompleteIndex={focusedAutocompleteIndex}
              onSelectTag={({ name }): void => onAddTag(name)}
              maxSuggestionCount={MAX_AUTOCOMPLETE_LENGTH}
            />
          )}
        </AutocompleteSuggestionsContainer>
      )}
    </form>
  );
};

export default InlineTagForm;
