// @flow
import { REQUEST_LOGIN, COMPLETE_LOGIN, CHANGE_LINK_LAYOUT, CHANGE_SEARCH_QUERY, LinkLayouts, LinkLayoutType } from '../actions/userInterface';

export type userInterfaceStateType = {
  loggingIn: boolean,
  linkLayout: LinkLayoutType,
  searchQuery: string
};

type Action = {type: string};
  // | { type: REQUEST_LOGIN }
  // | { type: COMPLETE_LOGIN }
  // | { type: CHANGE_LINK_LAYOUT, payload: LinkLayoutType };

const initialState: userInterfaceStateType = {
  loggingIn: false,
  linkLayout: LinkLayouts.LIST_LAYOUT,
  searchQuery: ''
};

export default function links(state: userInterfaceStateType = initialState, action: Action) {
  switch (action.type) {
    case REQUEST_LOGIN:
      return Object.assign({}, state, { loggingIn: true });
    case COMPLETE_LOGIN:
      return Object.assign({}, state, { loggingIn: false });
    case CHANGE_LINK_LAYOUT:
      return Object.assign({}, state, { linkLayout: action.payload });
    case CHANGE_SEARCH_QUERY:
      return Object.assign({}, state, { searchQuery: action.payload });
    default:
      return state;
  }
}
