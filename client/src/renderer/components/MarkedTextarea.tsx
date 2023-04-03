import { Tab, Tabs, TextField } from '@mui/material';
import Mousetrap from 'mousetrap';
import React, { useEffect, useRef, useState } from 'react';
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
  readOnly?: boolean;
};

const MarkedTextarea: React.FC<MarkedTextareaProps> = ({ name, readOnly }) => {
  const { control, getValues } = useFormContext();
  const [editDescription, setEditDescription] = useState(false);
  const [lastSelection, setLastSelection] = useState<[number, number] | null>(
    null
  );
  const textareaElement = useRef<HTMLTextAreaElement>();

  // mousetrap needs a self-updating reference
  const mousetrapRefs = useRef<{
    editDescription: boolean;
    lastSelection: [number, number] | null;
  }>();
  mousetrapRefs.current = { editDescription, lastSelection };

  const focusTextarea = (): void => {
    if (!textareaElement.current) {
      return;
    }
    if (document.activeElement !== textareaElement.current) {
      textareaElement.current.focus();
      if (mousetrapRefs.current?.lastSelection) {
        textareaElement.current.setSelectionRange(
          ...mousetrapRefs.current.lastSelection
        );
      } else {
        textareaElement.current.setSelectionRange(
          textareaElement.current.value.length,
          textareaElement.current.value.length
        );
      }
    }
  };

  const toggleEditDescription = (fromShortcut = false): void => {
    if (mousetrapRefs.current?.editDescription) {
      if (fromShortcut && document.activeElement !== textareaElement.current) {
        focusTextarea();
      } else {
        if (textareaElement.current) {
          if (fromShortcut) {
            setLastSelection([
              textareaElement.current.selectionStart,
              textareaElement.current.selectionEnd,
            ]);
            textareaElement.current.blur();
          } else {
            setLastSelection(null);
          }
        }
        setEditDescription(false);
      }
    } else {
      setEditDescription(true);
      setTimeout(() => {
        focusTextarea();
      }, 0);
    }
  };

  useEffect(() => {
    Mousetrap.bindGlobal(focusDescriptionShortcutKeys, () => {
      toggleEditDescription(true);
    });
    return (): void => {
      Mousetrap.unbind(focusDescriptionShortcutKeys);
    };
  }, []);

  useEffect(() => {
    if (getValues(name).length === 0 && !editDescription) {
      setEditDescription(true);
    }
  }, []);

  const renderMarkdown = () => <RenderedMarkdown markdown={getValues(name)} />;

  if (readOnly) {
    return renderMarkdown();
  }

  return (
    <TextareaContainer>
      <Tabs
        value={editDescription ? 1 : 0}
        onChange={() => {
          toggleEditDescription();
        }}
      >
        <Tab label="View" />
        <Tab label="Edit" disabled={readOnly} />
      </Tabs>
      <div hidden={!editDescription}>
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
              inputRef={(ref) => {
                field.ref(ref);
                textareaElement.current = ref;
              }}
              fullWidth
            />
          )}
        />
      </div>
      {!editDescription && renderMarkdown()}
    </TextareaContainer>
  );
};

export default MarkedTextarea;
