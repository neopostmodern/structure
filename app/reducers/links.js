// @flow
import { ADD_LINK, ADD_TAG_TO_LINK, REMOVE_LINK } from '../actions/links';

import UUID from '../utils/uuid';

export type LinkObject = {
  _id: string,
  url: string,
  domain: string,
  name: string,
  description: string,
  tags: Array<string>
}

export type linksStateType = {
  links: Array<LinkObject>
};

type actionType = {
  type: string,
  // payload: ?string
};

export default function links(state: Array<LinkObject> = [], action: actionType) {
  switch (action.type) {
    case ADD_LINK:
      return [...state, { id: UUID(), url: action.payload, tags: [] }];
    case ADD_TAG_TO_LINK:
      let linkIndex = state.findIndex(({id}) => id === action.payload.linkId);
      return [
        ...state.slice(0, linkIndex),
        Object.assign({}, state[linkIndex], { tags: [...state[linkIndex].tags, action.payload.tag] }),
        ...state.slice(linkIndex + 1)
      ];
    default:
      return state;
  }
}
