import { Tab, Tabs, TextField } from '@mui/material';
import React, { lazy, useEffect, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import useShortcut from '../hooks/useShortcut';
import { SHORTCUTS } from '../utils/keyboard';
import suspenseWrap from '../utils/suspenseWrap';
import RenderedMarkdown from './RenderedMarkdown';

const RichMarkdownEditor = suspenseWrap(
  lazy(() => import(/* webpackPrefetch: true */ './RichMarkdownEditor'))
);

const TextareaContainer = styled.div`
  position: relative;
  margin-top: 2px;
  min-height: 3rem;
`;

type MarkedTextareaProps = {
  name: string;
  readOnly?: boolean;
};

enum EditorTab {
  VIEW,
  RICH,
  SOURCE,
}

const MarkedTextarea: React.FC<MarkedTextareaProps> = ({ name, readOnly }) => {
  const { control, getValues } = useFormContext();
  const [editorTab, setEditorTab] = useState<EditorTab>(EditorTab.VIEW);
  const [lastSelection, setLastSelection] = useState<[number, number] | null>(
    null
  );
  const textareaElement = useRef<HTMLTextAreaElement>();

  // shortcuts need self-updating references
  const shortcutRefs = useRef<{
    editorTab: EditorTab;
    lastSelection: [number, number] | null;
  }>();
  shortcutRefs.current = { editorTab, lastSelection };

  const focusTextarea = (): void => {
    if (!textareaElement.current) {
      return;
    }
    if (document.activeElement !== textareaElement.current) {
      textareaElement.current.focus();
      if (shortcutRefs.current?.lastSelection) {
        textareaElement.current.setSelectionRange(
          ...shortcutRefs.current.lastSelection
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
    if (shortcutRefs.current?.editorTab === EditorTab.RICH) {
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
        setEditorTab(EditorTab.VIEW);
      }
    } else {
      setEditorTab(EditorTab.RICH);
      setTimeout(() => {
        focusTextarea();
      }, 0);
    }
  };

  useShortcut(SHORTCUTS.EDIT, () => {
    toggleEditDescription(true);
  });

  useEffect(() => {
    if (getValues(name).length === 0 && !editorTab) {
      setEditorTab(EditorTab.RICH);
    }
  }, []);

  const renderMarkdown = () => <RenderedMarkdown markdown={getValues(name)} />;

  if (readOnly) {
    return renderMarkdown();
  }

  return (
    <TextareaContainer>
      <Tabs
        value={editorTab}
        onChange={(_event, newTab) => {
          setEditorTab(newTab);
        }}
      >
        <Tab label="View" />
        <Tab label="Edit" disabled={readOnly} />
        <Tab label="Source" disabled={readOnly} />
      </Tabs>

      <div hidden={editorTab !== EditorTab.SOURCE}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <TextField
              multiline
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              hidden={!editorTab}
              value={field.value}
              variant="outlined"
              inputRef={(ref) => {
                field.ref(ref);
                textareaElement.current = ref;
              }}
              inputProps={{ style: { fontFamily: 'monospace' } }}
              fullWidth
            />
          )}
        />
      </div>
      {editorTab === EditorTab.VIEW && renderMarkdown()}
      {editorTab === EditorTab.RICH && (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <RichMarkdownEditor
              markdown={field.value}
              onBlur={(value) => field.onChange(value)}
            />
          )}
        />
      )}
    </TextareaContainer>
  );
};

export default MarkedTextarea;
