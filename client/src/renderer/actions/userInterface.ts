// todo: import breaks something -- circular dependency?
// import { BatchSelectionType } from '../reducers/userInterface';

export enum LinkLayout {
  LIST_LAYOUT = 'LIST_LAYOUT',
  EXPANDED_LIST_LAYOUT = 'EXPANDED_LIST_LAYOUT',
}
export enum TagsLayout {
  CHAOS_LAYOUT = 'CHAOS_LAYOUT',
  COLOR_LIST_LAYOUT = 'COLOR_LIST_LAYOUT',
  COLOR_COLUMN_LAYOUT = 'COLOR_COLUMN_LAYOUT',
}
export enum ArchiveState {
  NO_ARCHIVE = 'NO_ARCHIVE',
  ONLY_ARCHIVE = 'ONLY_ARCHIVE',
  BOTH = 'BOTH',
}

export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const COMPLETE_LOGIN = 'COMPLETE_LOGIN';
export const REQUEST_LOGOUT = 'REQUEST_LOGOUT';
export const CHANGE_LINK_LAYOUT = 'CHANGE_LINK_LAYOUT';
export const CHANGE_TAGS_LAYOUT = 'CHANGE_TAGS_LAYOUT';
export const CHANGE_ARCHIVE_STATE = 'CHANGE_ARCHIVE_STATE';
export const CHANGE_SEARCH_QUERY = 'CHANGE_SEARCH_QUERY';
export const INCREASE_INFINITE_SCROLL = 'INCREASE_INFINITE_SCROLL';
export const TOGGLE_BATCH_EDITING = 'TOGGLE_BATCH_EDITING';
export const SET_BATCH_SELECTED = 'TOGGLE_BATCH_SELECTION';
export const SET_BATCH_SELECTION = 'SET_BATCH_SELECTION';
export const REQUEST_CLIPBOARD = 'REQUEST_CLIPBOARD';
export const SET_CLIPBOARD = 'SET_CLIPBOARD';
export const CLEAR_CLIPBOARD = 'CLEAR_CLIPBOARD';

export function requestLogin() {
  return {
    type: REQUEST_LOGIN,
  };
}
export function requestLogout() {
  return {
    type: REQUEST_LOGOUT,
  };
}
export function completeLogin() {
  return {
    type: COMPLETE_LOGIN,
  };
}
export function changeLinkLayout(layout: LinkLayout) {
  return {
    type: CHANGE_LINK_LAYOUT,
    payload: layout,
  };
}
export function changeTagsLayout(layout: TagsLayout) {
  return {
    type: CHANGE_TAGS_LAYOUT,
    payload: layout,
  };
}
export function changeArchiveState(archiveState: ArchiveState) {
  return {
    type: CHANGE_ARCHIVE_STATE,
    payload: archiveState,
  };
}
export function changeSearchQuery(query: string) {
  return {
    type: CHANGE_SEARCH_QUERY,
    payload: query,
  };
}
export function increaseInfiniteScroll(by: number) {
  return {
    type: INCREASE_INFINITE_SCROLL,
    payload: by,
  };
}

export function toggleBatchEditing() {
  return {
    type: TOGGLE_BATCH_EDITING,
  };
}
export function setBatchSelected(noteId: string, selected: boolean) {
  return {
    type: SET_BATCH_SELECTED,
    payload: { noteId, selected },
  };
}
// todo: redundant type definition, but can't import -- see above
export function setBatchSelection(selection: { [id: string]: boolean }) {
  return {
    type: SET_BATCH_SELECTION,
    payload: selection,
  };
}

export function requestClipboard() {
  return {
    type: REQUEST_CLIPBOARD,
  };
}
export function setClipboard(clipboard: string) {
  return {
    type: SET_CLIPBOARD,
    payload: clipboard,
  };
}
export function clearClipboard() {
  return {
    type: CLEAR_CLIPBOARD,
  };
}
