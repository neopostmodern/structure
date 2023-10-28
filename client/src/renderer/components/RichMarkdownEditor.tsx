import StarterKit from '@tiptap/starter-kit';
import {
  MenuButtonBold,
  MenuButtonCode,
  MenuButtonCodeBlock,
  MenuButtonItalic,
  MenuButtonStrikethrough,
  MenuButtonTaskList,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
} from 'mui-tiptap';
import { Markdown } from 'tiptap-markdown';

Markdown.configure({
  linkify: true, // Create links from "https://..." text
  breaks: true, // New lines (\n) in markdown input are converted to <br>
  transformPastedText: true, // Allow to paste markdown text in the editor
});

const RichMarkdownEditor = ({
  markdown,
  onBlur,
}: {
  markdown: string;
  onBlur: (value: string) => void;
}) => {
  return (
    <RichTextEditor
      content={markdown}
      renderControls={() => (
        <MenuControlsContainer>
          <MenuSelectHeading />
          <MenuDivider />
          <MenuButtonBold />
          <MenuButtonItalic />
          {/*<MenuButtonUnderline />*/}
          <MenuButtonStrikethrough />
          <MenuDivider />
          <MenuButtonTaskList />
          <MenuDivider />
          <MenuButtonCode />
          <MenuButtonCodeBlock />

          {/* Add more controls of your choosing here */}
        </MenuControlsContainer>
      )}
      extensions={[StarterKit, Markdown]}
      onBlur={({ editor }) => onBlur(editor.storage.markdown.getMarkdown())}
    ></RichTextEditor>
  );
};

export default RichMarkdownEditor;
