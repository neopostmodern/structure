import marked from 'marked';
import styled from 'styled-components';

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

const MarkdownContainer = styled.div`
  p:last-child {
    margin-bottom: 0;
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
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: marked(markdown) }}
        style={{ fontSize: '1rem' }}
      />
    );
  }
  if (showEmpty) {
    return <EmptyTextarea>No content</EmptyTextarea>;
  }
  return null;
};

export default RenderedMarkdown;
