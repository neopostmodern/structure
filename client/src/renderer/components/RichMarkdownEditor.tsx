import ExtensionHardBreak from '@tiptap/extension-hard-break';
import ExtensionLink from '@tiptap/extension-link';
import ExtensionTableCell from '@tiptap/extension-table-cell';
import ExtensionTableHeader from '@tiptap/extension-table-header';
import ExtensionTableRow from '@tiptap/extension-table-row';
import ExtensionTaskItem from '@tiptap/extension-task-item';
import ExtensionTaskList from '@tiptap/extension-task-list';
import ExtensionUnderline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import {
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonCode,
  MenuButtonCodeBlock,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonStrikethrough,
  MenuButtonTaskList,
  MenuButtonUnderline,
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

const RichMarkdownEditor = ({
  markdown,
  onBlur,
}: {
  markdown: string;
  onBlur: (value: string) => void;
}) => {
  return (
    <RichTextEditorStyled
      content={markdown}
      renderControls={() => (
        <MenuControlsContainer>
          <MenuSelectHeading />
          <MenuDivider />
          <MenuButtonBold />
          <MenuButtonItalic />
          <MenuButtonUnderline />
          <MenuButtonStrikethrough />
          <MenuDivider />
          <MenuButtonBulletedList />
          <MenuButtonOrderedList />
          <MenuButtonTaskList />
          <MenuDivider />
          <MenuButtonCode />
          <MenuButtonCodeBlock />

          {/* Add more controls of your choosing here */}
        </MenuControlsContainer>
      )}
      children={() => <TableBubbleMenu />}
      extensions={[
        StarterKit,
        ExtensionHardBreak.extend({
          addKeyboardShortcuts() {
            return {
              Enter: () => {
                console.log(
                  this,
                  this.editor,
                  this.editor.commands,
                  this.editor.state
                );
                // console.log(this.editor.commands.selectNodeBackward());
                // console.log(this.editor.commands.selectParentNode());
                // console.log(this);
                return this.editor.commands.setHardBreak();
              },
            };
          },
        }),
        ExtensionUnderline,
        ExtensionTaskItem.configure({
          nested: true,
        }),
        ExtensionTaskList,
        TableImproved,
        ExtensionTableCell,
        ExtensionTableHeader,
        ExtensionTableRow,
        ExtensionLink,
        Markdown.configure({
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
