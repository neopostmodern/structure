import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { JSDOM } from 'jsdom';
import { ClipboardEventMock, DragEventMock } from './mocks';

const dynamicImport = new Function('specifier', 'return import(specifier)');
const main = async () => {
  // import { Markdown } from 'tiptap-markdown';
  const { Markdown } = await dynamicImport('tiptap-markdown');
  // const { MarkdownParser } = await dynamicImport(
  //   'tiptap-markdown/parse/markdownParser'
  // );
  // console.dir(MarkdownParser);

  const { window } = new JSDOM();
  (global as any).window = window;
  (global as any).document = window.document;
  (global as any).navigator = window.navigator;
  (global as any).Node = window.Node;
  (global as any).ClipboardEvent = ClipboardEventMock;
  (global as any).DragEvent = DragEventMock;

  // console.dir(Markdown);
  // console.dir(new (Markdown as any)({}));

  const editorIn = new Editor({
    extensions: [StarterKit, Markdown.configure({ breaks: true })],
  });
  const editorOut = new Editor({
    extensions: [StarterKit, Markdown.configure({})],
  });
  editorIn.commands.setContent(
    '**test**\nhello\n\nparagraph 2\n\n\nparagraph 3'
  ); // setContent supports markdown format
  editorOut.commands.setContent(editorIn.getJSON());
  console.log(editorOut.storage.markdown.getMarkdown()); // get current content as markdown
};

main();
