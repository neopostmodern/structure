import { Button } from '@mui/material';
import marked from 'marked';
import Mousetrap from 'mousetrap';
import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import makeMousetrapGlobal from '../utils/mousetrapGlobal';
import shortcutKeysToString from '../utils/shortcutKeysToString';
import { DescriptionTextarea } from './formComponents';

makeMousetrapGlobal(Mousetrap);

const renderer = new marked.Renderer();
renderer.listitem = (text: string): string => {
  if (/^\s*\[[x ]\]\s*/.test(text)) {
    const textWithListItems = text
      .replace(/^\s*\[ \]\s*/, '☐ ')
      .replace(/^\s*\[x\]\s*/, '☑ ');
    return `<li style="list-style: none; margin-left: -1.3rem;">${textWithListItems}</li>`;
  }
  return `<li>${text}</li>`;
};

renderer.link = (href: string, title: string, text: string): string =>
  `<a href="${href}" title="${
    title || href
  }" target="_blank" rel="noopener noreferrer">${text}</a>`;

marked.setOptions({
  breaks: true,
  renderer,
});

const markedTextareaPadding = '1rem';

const TextareaContainer = styled.div`
  position: relative;
  margin-top: 2px;
  min-height: 3rem;
`;

const EmptyTextarea = styled.div`
  border: 1px dashed gray;
  color: gray;

  text-align: center;
  padding-top: 1.5rem;
  padding-bottom: 1.3rem;
`;

const EditButton = styled(Button)`
  position: absolute;
  top: ${markedTextareaPadding};
  right: ${markedTextareaPadding};

  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none;

  ${TextareaContainer}:hover & {
    opacity: 1;
    pointer-events: all;
  }
`;

const focusDescriptionShortcutKeys = ['ctrl+e', 'command+e'];

type MarkedTextareaProps = {
  name: string;
};

const MarkedTextarea: React.FC<MarkedTextareaProps> = ({ name }) => {
  const { watch, register } = useFormContext();
  const textareaElement = useRef<HTMLTextAreaElement>();
  const [editDescription, setEditDescription] = useState(false);
  // mousetrap needs a self-updating reference
  const editDescriptionRef = useRef<boolean>();
  editDescriptionRef.current = editDescription;

  const focusTextarea = (): void => {
    if (document.activeElement !== textareaElement.current) {
      // eslint-disable-next-line no-unused-expressions
      textareaElement.current?.focus();
    }
  };

  const toggleEditDescription = (): void => {
    const currentEditDescriptionStatus = editDescriptionRef.current;

    if (currentEditDescriptionStatus) {
      textareaElement.current.blur();
      setEditDescription(false);
    } else {
      setEditDescription(true);
      focusTextarea();
    }
  };

  useEffect(() => {
    Mousetrap.bindGlobal(focusDescriptionShortcutKeys, toggleEditDescription);
    return (): void => {
      Mousetrap.unbind(focusDescriptionShortcutKeys);
    };
  }, []);

  let content;
  if (!editDescription) {
    const textContent = watch(name);

    if (textContent && textContent.length) {
      content = (
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: marked(textContent) }}
          style={{ fontSize: '1rem' }}
        />
      );
    } else {
      content = <EmptyTextarea>No content</EmptyTextarea>;
    }
  }

  const formFieldProperties = register(name);

  return (
    <TextareaContainer>
      <EditButton
        variant="outlined"
        size="small"
        onClick={toggleEditDescription}
        title={shortcutKeysToString(focusDescriptionShortcutKeys)}
      >
        {editDescription ? 'Done' : 'Edit'}
      </EditButton>
      <DescriptionTextarea
        name={name}
        ref={(ref): void => {
          textareaElement.current = ref;
          formFieldProperties.ref(ref);
        }}
        onBlur={formFieldProperties.onBlur}
        onChange={formFieldProperties.onChange}
        hidden={!editDescription}
      />
      {content}
    </TextareaContainer>
  );
};

export default MarkedTextarea;
