// @flow

export const ADD_LINK = 'ADD_LINK';
export const REMOVE_LINK = 'REMOVE_LINK';
export const ADD_TAG_TO_LINK = 'ADD_TAG_TO_LINK';

export function addLink(link: string) {
  return {
    type: ADD_LINK,
    payload: link
  };
}

export function addTagToLink(linkId: string, tag: string) {
  return {
    type: ADD_TAG_TO_LINK,
    payload: {
      linkId,
      tag
    }
  };
}

export function removeLink(link: string) {
  return {
    type: REMOVE_LINK
  };
}

// export function incrementAsync(delay: number = 1000) {
//   return (dispatch: () => void) => {
//     setTimeout(() => {
//       dispatch(increment());
//     }, delay);
//   };
// }
