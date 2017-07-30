// @flow

export const LinkLayouts = {
  LIST_LAYOUT: 'LIST_LAYOUT',
  GRID_LAYOUT: 'GRID_LAYOUT'
};
export type LinkLayoutType = $Keys<typeof LinkLayouts>;

export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const COMPLETE_LOGIN = 'COMPLETE_LOGIN';
export const CHANGE_LINK_LAYOUT = 'CHANGE_LINK_LAYOUT';
export const CHANGE_SEARCH_QUERY = 'CHANGE_SEARCH_QUERY';
export const INCREASE_INFINITE_SCROLL = 'INCREASE_INFINITE_SCROLL';

export function requestLogin() {
  return {
    type: REQUEST_LOGIN
  };
}
export function completeLogin() {
  return {
    type: COMPLETE_LOGIN
  };
}
export function changeLinkLayout(layout: LinkLayoutType) {
  return {
    type: CHANGE_LINK_LAYOUT,
    payload: layout
  };
}
export function changeSearchQuery(query: string) {
  return {
    type: CHANGE_SEARCH_QUERY,
    payload: query
  };
}
export function increaseInfiniteScroll(by: number) {
  return {
    type: INCREASE_INFINITE_SCROLL,
    payload: by
  };
}
