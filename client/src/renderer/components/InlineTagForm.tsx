import { Autocomplete, TextField, Typography } from '@mui/material';
import { matchSorter } from 'match-sorter';
import React from 'react';
import { TagsWithCountsQuery } from '../generated/graphql';
import useUserId from '../hooks/useUserId';
import Tag from './Tag';

type TagType = TagsWithCountsQuery['tags'][number];
type TagOrNewTagType = TagType | { newTagName: string; title: string };

type InlineTagFormProps = {
  tags: 'loading' | Array<TagType>;
  onAddTag: (tagName: string) => void;
  onAbort: () => void;
};

const MAX_TAG_SUGGESTIONS = 20;
const TAG_OVERFLOW = 'TAG_OVERFLOW';

const InlineTagForm: React.FC<InlineTagFormProps> = ({
  onAddTag,
  onAbort,
  tags,
}) => {
  const userId = useUserId();

  return (
    <>
      {tags === 'loading' ? (
        '...'
      ) : (
        <Autocomplete<TagOrNewTagType, false, false, true>
          open
          autoHighlight
          disablePortal
          onChange={(_event, newValue) => {
            if (typeof newValue === 'string') {
              throw Error(
                `[InlineTagForm.onChange] Illegal input - shouldn't receive string '${newValue}'!`
              );
            }
            if (newValue) {
              onAddTag(
                'newTagName' in newValue ? newValue.newTagName : newValue.name
              );
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              onAbort();
            }
          }}
          onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
            if (event.target.value.length === 0) {
              onAbort();
            }
          }}
          freeSolo
          filterOptions={(options, params) => {
            const { inputValue } = params;

            let filtered: Array<TagOrNewTagType> = matchSorter(
              options as Array<TagType>,
              inputValue,
              {
                keys: [(tag) => tag.name.replace(/[:›>]/g, ' ')],
                baseSort: ({ item: tagA }, { item: tagB }) =>
                  Math.sign(tagB.noteCount - tagA.noteCount),
              }
            );

            let hiddenCount = 0;
            if (filtered.length > MAX_TAG_SUGGESTIONS) {
              hiddenCount = filtered.length - MAX_TAG_SUGGESTIONS;
              filtered = filtered.slice(0, MAX_TAG_SUGGESTIONS);
            }

            // Suggest the creation of a new value
            const isExisting = options.some(
              (option) => inputValue === (option as TagType).name
            );
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                newTagName: inputValue,
                title: `Add "${inputValue}"`,
              });
            }

            if (hiddenCount) {
              filtered.push({
                newTagName: TAG_OVERFLOW,
                title: `${hiddenCount} more matches, refine your search`,
              });
            }

            return filtered;
          }}
          getOptionLabel={(option) => {
            if (typeof option === 'string') {
              throw Error(
                `[InlineTagForm.getOptionLabel] Illegal input - shouldn't receive string '${option}'!`
              );
            }

            return 'newTagName' in option ? option.newTagName : option.name;
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Add tag"
              autoFocus
              size="small"
              style={{ width: '200px' }}
            />
          )}
          options={tags}
          renderOption={(props, tag) => {
            let tagElement;
            if ('newTagName' in tag) {
              if (tag.newTagName === TAG_OVERFLOW) {
                return (
                  <li
                    key={props.key}
                    className={props.className}
                    style={{ cursor: 'initial' }}
                  >
                    <Typography variant="caption" key={TAG_OVERFLOW}>
                      {tag.title}
                    </Typography>
                  </li>
                );
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
                );
              }
            } else {
              tagElement = <Tag onClick={() => {}} tag={tag} />;
            }
            const { key, ...propsToPass } = props;
            return (
              <li key={'_id' in tag ? tag._id : 'NEW_TAG'} {...propsToPass}>
                {tagElement}
              </li>
            );
          }}
        />
      )}
    </>
  );
};

export default InlineTagForm;
