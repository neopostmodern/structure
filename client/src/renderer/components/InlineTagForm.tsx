import { Autocomplete, TextField } from '@mui/material';
import { matchSorter } from 'match-sorter';
import React from 'react';
import { TagsQuery } from '../generated/graphql';
import Tag from './Tag';

type TagType = TagsQuery['tags'][number];
type TagOrNewTagType = TagType | { newTagName: string; title: string };

type InlineTagFormProps = {
  tags: 'loading' | TagsQuery['tags'];
  onAddTag: (tagName: string) => void;
  onAbort: () => void;
};

const InlineTagForm: React.FC<InlineTagFormProps> = ({
  onAddTag,
  onAbort,
  tags,
}) => {
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

            const filtered = matchSorter(options, inputValue, {
              keys: ['name'],
            });

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
              tagElement = (
                <>
                  <div style={{ marginRight: '0.5em' }}>Create&nbsp;tag</div>
                  <Tag
                    onClick={() => {}}
                    tag={{
                      _id: 'NEW_TAG',
                      name: tag.newTagName,
                      color: 'gray',
                    }}
                  />
                </>
              );
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
