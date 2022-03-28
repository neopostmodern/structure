import { Tab, Tabs, TextField } from '@mui/material';
import Mousetrap from 'mousetrap';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import makeMousetrapGlobal from '../utils/mousetrapGlobal';
import RenderedMarkdown from './RenderedMarkdown';

makeMousetrapGlobal(Mousetrap);

const TextareaContainer = styled.div`
  position: relative;
  margin-top: 2px;
  min-height: 3rem;
`;

const focusDescriptionShortcutKeys = ['ctrl+e', 'command+e'];

type MarkedTextareaProps = {
  name: string;
};

const MarkedTextarea: React.FC<MarkedTextareaProps> = ({ name }) => {
  const { control, getValues } = useFormContext();
  const [editDescription, setEditDescription] = useState(false);
  const [shouldAutofocus, setShouldAutofocus] = useState(false);

  const toggleEditDescription = useCallback(() => {
    setEditDescription(!editDescription);
  }, [setEditDescription, editDescription]);

  useEffect(() => {
    Mousetrap.bindGlobal(focusDescriptionShortcutKeys, toggleEditDescription);
    return (): void => {
      Mousetrap.unbind(focusDescriptionShortcutKeys);
    };
  }, [toggleEditDescription]);

  useEffect(() => {
    if (getValues(name).length === 0 && !editDescription) {
      setEditDescription(true);
    }
  }, []);

  return (
    <TextareaContainer>
      <Tabs
        value={editDescription ? 1 : 0}
        onChange={(_, value: number) => {
          setEditDescription(Boolean(value));
          setShouldAutofocus(true);
        }}
      >
        <Tab label="View" />
        <Tab label="Edit" />
      </Tabs>
      {editDescription ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <TextField
              multiline
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              hidden={!editDescription}
              value={field.value}
              variant="outlined"
              ref={field.ref}
              autoFocus={shouldAutofocus}
              fullWidth
              onFocus={(event) => {
                event.target.setSelectionRange(
                  event.target.value.length,
                  event.target.value.length
                );
              }}
            />
          )}
        />
      ) : (
        <RenderedMarkdown markdown={getValues(name)} />
      )}
    </TextareaContainer>
  );
};

export default MarkedTextarea;
