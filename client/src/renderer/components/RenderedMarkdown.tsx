import React from 'react';
import ReactMarkdown from 'react-markdown';
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

    li {
      &.task-list-item {
        list-style: none;
        margin-left: -${listIndent};
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
          input({ checked }) {
            return checked ? '☐ ' : '☑ ';
          },
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
