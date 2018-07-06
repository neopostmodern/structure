// @flow
import {
  REQUEST_LOGIN, COMPLETE_LOGIN, CHANGE_LINK_LAYOUT, CHANGE_TAGS_LAYOUT, CHANGE_SEARCH_QUERY,
  INCREASE_INFINITE_SCROLL, LinkLayouts, TagsLayouts, ArchiveStates,
  CHANGE_ARCHIVE_STATE, REQUEST_METADATA, RECEIVED_METADATA, CLEAR_METADATA, TOGGLE_BATCH_EDITING,
  TOGGLE_BATCH_SELECTION, SET_BATCH_SELECTION,
  CLEAR_CLIPBOARD, SET_CLIPBOARD,
  type LinkLayoutType, type TagsLayoutsType, type ArchiveStateType
} from '../actions/userInterface';

export type BatchSelectionType = {
  [string]: boolean
};

export type userInterfaceStateType = {
  loggingIn: boolean,
  linkLayout: LinkLayoutType,
  tagsLayout: TagsLayoutsType,
  archiveState: ArchiveStateType,
  searchQuery: string,
  infiniteScrollLimit: number,
  metadata?: {
    titles: Array<string>
  },
  metadataLoading: boolean,
  batchEditing: boolean,
  batchSelections: BatchSelectionType,
  clipboard?: string
};

type Action = { type: string, payload?: any };
// | { type: REQUEST_LOGIN }
// | { type: COMPLETE_LOGIN }
// | { type: CHANGE_LINK_LAYOUT, payload: LinkLayoutType };

const initialState: userInterfaceStateType = {
  loggingIn: false,
  linkLayout: LinkLayouts.LIST_LAYOUT,
  tagsLayout: TagsLayouts.CHAOS_LAYOUT,
  archiveState: ArchiveStates.NO_ARCHIVE,
  searchQuery: '',
  infiniteScrollLimit: 10,
  batchEditing: false,
  batchSelections: {},
  metadataLoading: false
};

export default function links(state: userInterfaceStateType = initialState, action: Action) {
  function deleteFields(nextState, fields) {
    // eslint-disable-next-line no-param-reassign
    fields.forEach((field) => delete nextState[field]);
    return nextState;
  }
  switch (action.type) {
    case REQUEST_LOGIN:
      return Object.assign({}, state, { loggingIn: true });
    case COMPLETE_LOGIN:
      return Object.assign({}, state, { loggingIn: false });
    case CHANGE_LINK_LAYOUT:
      return Object.assign({}, state, { linkLayout: action.payload });
    case CHANGE_TAGS_LAYOUT:
      return Object.assign({}, state, { tagsLayout: action.payload });
    case CHANGE_ARCHIVE_STATE:
      return Object.assign({}, state, { archiveState: action.payload });
    case CHANGE_SEARCH_QUERY:
      return Object.assign({}, state, { searchQuery: action.payload });
    case INCREASE_INFINITE_SCROLL:
      return Object.assign({}, state, {
        infiniteScrollLimit: state.infiniteScrollLimit + action.payload
      });
    case REQUEST_METADATA:
      return Object.assign({}, state, { metadataLoading: true });
    case RECEIVED_METADATA:
      return Object.assign({}, state, { metadataLoading: false, metadata: action.payload });
    case CLEAR_METADATA:
      return deleteFields(Object.assign({}, state, { metadataLoading: false }), ['metadata']);
    case TOGGLE_BATCH_EDITING:
      return Object.assign({}, state, { batchEditing: !state.batchEditing });
    case TOGGLE_BATCH_SELECTION:
      return Object.assign({}, state, {
        batchSelections: Object.assign(
          {},
          state.batchSelections,
          {
            [action.payload]: !state.batchSelections[action.payload]
          }
        )
      });
    case SET_BATCH_SELECTION:
      return Object.assign({}, state, { batchSelections: action.payload });
    case SET_CLIPBOARD:
      return Object.assign({}, state, { clipboard: action.payload });
    case CLEAR_CLIPBOARD:
      return deleteFields(Object.assign({}, state), ['clipboard']);
    default:
      return state;
  }
}
