import { Editor } from '@tiptap/core'
import ExtensionLink from '@tiptap/extension-link'
import ExtensionTable from '@tiptap/extension-table'
import ExtensionTableCell from '@tiptap/extension-table-cell'
import ExtensionTableHeader from '@tiptap/extension-table-header'
import ExtensionTableRow from '@tiptap/extension-table-row'
import ExtensionTaskItem from '@tiptap/extension-task-item'
import ExtensionTaskList from '@tiptap/extension-task-list'
import ExtensionUnderline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { JSDOM } from 'jsdom'
import { Markdown } from 'tiptap-markdown'

export class ClipboardDataMock {
  getData: () => string
  setData: (a: string, b: string) => undefined

  constructor() {
    this.getData = () => ''
    this.setData = () => undefined
  }
}

export class ClipboardEventMock extends Event {
  clipboardData: ClipboardDataMock

  constructor(type: string, options?: EventInit) {
    super(type, options)
    this.clipboardData = new ClipboardDataMock()
  }
}

export class DataTransferMock {
  data: { [key: string]: string }

  constructor() {
    this.data = {}
  }

  setData(format: string, data: string): void {
    this.data[format] = data
  }

  getData(format: string): string {
    return this.data[format] || ''
  }
}

export class DragEventMock extends Event {
  dataTransfer: DataTransferMock

  constructor(type: string, options?: EventInit) {
    super(type, options)
    this.dataTransfer = new DataTransferMock()
  }
}

export const createTiptapMigrator = async () => {
  // const { Markdown } = await dynamicImport('tiptap-markdown');

  const { window } = new JSDOM()
  ;(global as any).window = window
  ;(global as any).document = window.document
  ;(global as any).navigator = window.navigator
  ;(global as any).Node = window.Node
  ;(global as any).ClipboardEvent = ClipboardEventMock
  ;(global as any).DragEvent = DragEventMock

  const commonExtensions = [
    StarterKit,
    ExtensionUnderline,
    ExtensionTaskItem.configure({
      nested: true,
    }),
    ExtensionTaskList,
    ExtensionTable,
    ExtensionTableCell,
    ExtensionTableHeader,
    ExtensionTableRow,
    ExtensionLink.configure({
      autolink: true,
    }),
    Markdown.configure({
      html: true,
      linkify: true, // Create links from "https://..." text
    }),
  ]

  const editorIn = new Editor({
    extensions: [...commonExtensions, Markdown.configure({ breaks: true })],
  })
  const editorOut = new Editor({
    extensions: [...commonExtensions, Markdown.configure({})],
  })

  return (markdown: string): string => {
    editorIn.commands.setContent(markdown)
    editorOut.commands.setContent(editorIn.getJSON())
    return editorOut.storage.markdown.getMarkdown()
  }
}

export const destroyTiptapMigrator = () => {
  delete (global as any).window
  delete (global as any).document
  delete (global as any).navigator
  delete (global as any).Node
  delete (global as any).ClipboardEvent
  delete (global as any).DragEvent
}
