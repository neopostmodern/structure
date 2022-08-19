import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';

const listIndent = '2em';

const MarkdownContainer = styled(ReactMarkdown)`
  font-size: 1rem;

  p:last-child {
    margin-bottom: 0;
  }

  ul,
  ol {
    padding-left: ${listIndent};

    ul,
    ol {
      padding-left: 0.9em;
      &.contains-task-list {
        padding-left: 1.1em;
      }
    }

    li {
      &.task-list-item {
        list-style: none;
      }

      > p {
        margin: 0;
      }
    }
  }

  @media (prefers-color-scheme: dark) {
    a {
      color: #3485ff;
    }
  }

  blockquote {
    margin: 0;
    border-left: 2px gray solid;
    padding: 0 1em;
  }

  code {
    padding: 0.1em 0.2em;
    border-radius: 2px;
    background-color: rgba(128, 128, 128, 0.4);
  }

  pre {
    max-width: 100%;
    overflow-x: auto;

    padding: 0.5em;
    border-radius: 2px;
    background-color: rgba(128, 128, 128, 0.4);

    > code {
      padding: initial;
      background-color: initial;
    }
  }
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
      <MarkdownContainer
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
      </MarkdownContainer>
    );
  }
  if (showEmpty) {
    return <EmptyTextarea>No content</EmptyTextarea>;
  }
  return null;
};

export default React.memo(RenderedMarkdown);
