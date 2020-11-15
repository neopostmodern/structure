// todo: import breaks something -- circular dependency?
// import { BatchSelectionType } from '../reducers/userInterface';

export enum LinkLayout {
  LIST_LAYOUT = 'LIST_LAYOUT',
  GRID_LAYOUT = 'GRID_LAYOUT',
}
export enum TagsLayout {
  CHAOS_LAYOUT = 'CHAOS_LAYOUT',
  COLOR_LIST_LAYOUT = 'COLOR_LIST_LAYOUT',
  COLOR_COLUMN_LAYOUT = 'COLOR_COLUMN_LAYOUT',
  COLOR_WHEEL_LAYOUT = 'COLOR_WHEEL_LAYOUT',
}
export enum ArchiveState {
  NO_ARCHIVE = 'NO_ARCHIVE',
  ONLY_ARCHIVE = 'ONLY_ARCHIVE',
  BOTH = 'BOTH',
}

export const REQUEST_LOGIN = 'REQUEST_LOGIN'
export const COMPLETE_LOGIN = 'COMPLETE_LOGIN'
export const CHANGE_LINK_LAYOUT = 'CHANGE_LINK_LAYOUT'
export const CHANGE_TAGS_LAYOUT = 'CHANGE_TAGS_LAYOUT'
export const CHANGE_ARCHIVE_STATE = 'CHANGE_ARCHIVE_STATE'
export const CHANGE_SEARCH_QUERY = 'CHANGE_SEARCH_QUERY'
export const INCREASE_INFINITE_SCROLL = 'INCREASE_INFINITE_SCROLL'
export const REQUEST_METADATA = 'REQUEST_METADATA'
export const RECEIVED_METADATA = 'RECEIVED_METADATA'
export const CLEAR_METADATA = 'CLEAR_METADATA'
export const TOGGLE_BATCH_EDITING = 'TOGGLE_BATCH_EDITING'
export const SET_BATCH_SELECTED = 'TOGGLE_BATCH_SELECTION'
export const SET_BATCH_SELECTION = 'SET_BATCH_SELECTION'
export const REQUEST_CLIPBOARD = 'REQUEST_CLIPBOARD'
export const SET_CLIPBOARD = 'SET_CLIPBOARD'
export const CLEAR_CLIPBOARD = 'CLEAR_CLIPBOARD'

export function requestLogin() {
  return {
    type: REQUEST_LOGIN,
  }
}
export function completeLogin() {
  return {
    type: COMPLETE_LOGIN,
  }
}
export function changeLinkLayout(layout: LinkLayout) {
  return {
    type: CHANGE_LINK_LAYOUT,
    payload: layout,
  }
}
export function changeTagsLayout(layout: TagsLayout) {
  return {
    type: CHANGE_TAGS_LAYOUT,
    payload: layout,
  }
}
export function changeArchiveState(archiveState: ArchiveState) {
  return {
    type: CHANGE_ARCHIVE_STATE,
    payload: archiveState,
  }
}
export function changeSearchQuery(query: string) {
  return {
    type: CHANGE_SEARCH_QUERY,
    payload: query,
  }
}
export function increaseInfiniteScroll(by: number) {
  return {
    type: INCREASE_INFINITE_SCROLL,
    payload: by,
  }
}

export function requestMetadata(url: string) {
  return {
    type: REQUEST_METADATA,
    payload: url,
  }
}
export function receivedMetadata(metadata: object) {
  return {
    type: RECEIVED_METADATA,
    payload: metadata,
  }
}
export function clearMetadata() {
  return {
    type: CLEAR_METADATA,
  }
}

export function toggleBatchEditing() {
  return {
    type: TOGGLE_BATCH_EDITING,
  }
}
export function setBatchSelected(noteId: string, selected: boolean) {
  return {
    type: SET_BATCH_SELECTED,
    payload: { noteId, selected },
  }
}
// todo: redundant type definition, but can't import -- see above
export function setBatchSelection(selection: { [id: string]: boolean }) {
  return {
    type: SET_BATCH_SELECTION,
    payload: selection,
  }
}

export function requestClipboard() {
  return {
    type: REQUEST_CLIPBOARD,
  }
}
export function setClipboard(clipboard: string) {
  return {
    type: SET_CLIPBOARD,
    payload: clipboard,
  }
}
export function clearClipboard() {
  return {
    type: CLEAR_CLIPBOARD,
  }
}
