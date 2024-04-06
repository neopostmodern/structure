import ExtensionLink from '@tiptap/extension-link';
import ExtensionTableCell from '@tiptap/extension-table-cell';
import ExtensionTableHeader from '@tiptap/extension-table-header';
import ExtensionTableRow from '@tiptap/extension-table-row';
import ExtensionTaskItem from '@tiptap/extension-task-item';
import ExtensionTaskList from '@tiptap/extension-task-list';
import ExtensionUnderline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import {
  isTouchDevice,
  LinkBubbleMenu,
  LinkBubbleMenuHandler,
  MenuButtonAddTable,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonCode,
  MenuButtonCodeBlock,
  MenuButtonEditLink,
  MenuButtonIndent,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonRedo,
  MenuButtonRemoveFormatting,
  MenuButtonStrikethrough,
  MenuButtonTaskList,
  MenuButtonUnderline,
  MenuButtonUndo,
  MenuButtonUnindent,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
  TableBubbleMenu,
  TableImproved,
} from 'mui-tiptap';
import styled from 'styled-components';
import { Markdown } from 'tiptap-markdown';
import { markdownStyles } from './RenderedMarkdown';

const RichTextEditorStyled = styled(RichTextEditor)`
  .MuiTiptap-RichTextContent-root .ProseMirror {
    ${markdownStyles}
  }
`;

const markdownMigration = (text) => {
  return text;
};

const RichMarkdownEditor = ({
  markdown,
  onBlur,
}: {
  markdown: string;
  onBlur: (value: string) => void;
}) => {
  const migratedMarkdown = markdownMigration(markdown);

  return (
    <RichTextEditorStyled
      content={migratedMarkdown}
      renderControls={() => (
        <MenuControlsContainer>
          <MenuSelectHeading />
          <MenuDivider />
          <MenuButtonBold />
          <MenuButtonItalic />
          <MenuButtonUnderline />
          <MenuButtonStrikethrough />
          <MenuButtonEditLink />
          <MenuDivider />
          <MenuButtonBulletedList />
          <MenuButtonOrderedList />
          <MenuButtonTaskList />
          {isTouchDevice() && (
            <>
              <MenuButtonIndent />

              <MenuButtonUnindent />
            </>
          )}
          <MenuDivider />
          <MenuButtonCode />
          <MenuButtonCodeBlock />
          <MenuDivider />
          <MenuButtonAddTable />
          <MenuDivider />
          <MenuButtonUndo />
          <MenuButtonRedo />
          <MenuButtonRemoveFormatting />

          {/* Add more controls of your choosing here */}
        </MenuControlsContainer>
      )}
      children={() => (
        <>
          <TableBubbleMenu />
          <LinkBubbleMenu />
        </>
      )}
      extensions={[
        StarterKit,
        ExtensionUnderline,
        ExtensionTaskItem.configure({
          nested: true,
        }),
        ExtensionTaskList,
        TableImproved,
        ExtensionTableCell,
        ExtensionTableHeader,
        ExtensionTableRow,
        ExtensionLink.extend({
          inclusive: false,
        }).configure({
          autolink: true,
          linkOnPaste: true,
          openOnClick: false,
        }),
        LinkBubbleMenuHandler,
        Markdown.configure({
          html: true,
          linkify: true, // Create links from "https://..." text
          breaks: true, // New lines (\n) in markdown input are converted to <br>
          transformPastedText: true, // Allow to paste markdown text in the editor
        }),
      ]}
      onBlur={({ editor }) => onBlur(editor.storage.markdown.getMarkdown())}
    ></RichTextEditorStyled>
  );
};

export default RichMarkdownEditor;
