import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import styled, { css } from 'styled-components';

const listIndent = '1.8em';

export const markdownStyles = css`
  &:not(.ProseMirror) {
    padding: 1em 0;
  }

  > :first-child {
    margin-block-start: 0;
  }
  > :last-child {
    margin-block-end: 0;
  }

  h1,
  h2,
  h3,
  h4 {
    line-height: initial;
    margin-bottom: 0;
  }

  h1 + h2,
  h1 + h3,
  h2 + h3,
  h2 + h4,
  h3 + h4 {
    margin-top: 0.5em;
  }

  h2 {
    font-size: 1.5em;
    font-weight: bold;
    margin-block-start: 1em;
    margin-block-end: 0.66em;
  }

  p,
  pre,
  table,
  ul,
  ol {
    margin-bottom: 1em;
  }
  p:last-child {
    margin-bottom: 0;
  }

  ul,
  ol {
    padding-left: ${listIndent};

    ul,
    ol {
      padding-left: 0.9em;
      margin-bottom: 0.2em;
      &.contains-task-list {
        padding-left: 1.1em;
      }
    }

    &[data-type='taskList'] {
      p:first-child + ul,
      p:first-child + ol {
        margin-top: -0.8em;
      }
    }

    li {
      &.task-list-item {
        list-style: none;
      }

      ul:not([data-type='taskList']) li {
        // workaround for sub-lists of checklists
        display: list-item;
      }

      ul[data-type='taskList'] {
        margin-left: -1.5em;
      }

      > p {
        margin: 0;
      }
    }
  }

  ol:has(> li:nth-child(10)) {
    padding-left: 2em;
  }

  p + p,
  p + ul,
  p + ol,
  ul + p,
  ol + p {
    //margin-top: -0.5em;
  }

  a:not([data-type='mention']) {
    color: blue;
    text-decoration: underline;

    @media (prefers-color-scheme: dark) {
      color: #3485ff;
    }
  }

  blockquote {
    margin: 0;
    border-left: 2px gray solid;
    padding: 0 1em;
  }
  blockquote::before {
    display: none;
  }

  code {
    padding: 0.1em 0.2em;
    border-radius: 2px;
    background-color: rgba(128, 128, 128, 0.4);
    border: none;
    color: inherit;
  }

  pre {
    max-width: 100%;
    overflow-x: auto;

    padding: 0.5em;
    border-radius: 2px;
    border: none;
    background-color: rgba(128, 128, 128, 0.4);

    > code {
      padding: initial;
      background-color: initial;
    }
  }

  table {
    min-width: 100%;
  }
`;

const MarkdownContainer = styled.div`
  font-size: 1rem;

  ${markdownStyles}
`;

const EmptyTextarea = styled.div`
  border: 1px dashed gray;
  color: gray;

  text-align: center;
  padding-top: 1.5rem;
  padding-bottom: 1.3rem;
`;

const CheckboxWrapper = styled.div`
  position: relative;
  width: 0;
`;
const CheckboxContainer = styled.div`
  position: absolute;
  right: 0.2em;
`;
const ReadonlyCheckbox = ({ checked }) => (
  <CheckboxWrapper>
    <CheckboxContainer>{checked ? '☑' : '☐'}</CheckboxContainer>
  </CheckboxWrapper>
);

const RenderedMarkdown = ({
  markdown,
  showEmpty = true,
}: {
  markdown: string;
  showEmpty?: boolean;
}) => {
  if (markdown.length) {
    return (
      <MarkdownContainer>
        <ReactMarkdown
          rehypePlugins={[
            rehypeRaw,
            [
              rehypeSanitize,
              { ...defaultSchema, tagNames: [...defaultSchema.tagNames!, 'u'] },
            ],
          ]}
          remarkPlugins={[remarkBreaks, [remarkGfm, { singleTilde: false }]]}
          components={{
            a({ href, title, children }) {
              return (
                <a
                  href={href}
                  title={title || href}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {children}
                </a>
              );
            },
            input: ReadonlyCheckbox,
          }}
        >
          {markdown}
        </ReactMarkdown>
      </MarkdownContainer>
    );
  }
  if (showEmpty) {
    return <EmptyTextarea>No content</EmptyTextarea>;
  }
  return null;
};

export default React.memo(RenderedMarkdown);
