import {
  ArchiveState,
  CHANGE_ARCHIVE_STATE,
  CHANGE_LINK_LAYOUT,
  CHANGE_SEARCH_QUERY,
  CHANGE_TAGS_LAYOUT,
  CLEAR_CLIPBOARD,
  COMPLETE_LOGIN,
  INCREASE_INFINITE_SCROLL,
  LinkLayout,
  REQUEST_LOGIN,
  REQUEST_LOGOUT,
  SET_BATCH_SELECTED,
  SET_BATCH_SELECTION,
  SET_CLIPBOARD,
  TagsLayout,
  TOGGLE_BATCH_EDITING,
} from '../actions/userInterface';

export type BatchSelectionType = {
  [id: string]: boolean;
};

export interface UserInterfaceStateType {
  loggingIn: boolean;
  linkLayout: LinkLayout;
  tagsLayout: TagsLayout;
  archiveState: ArchiveState;
  searchQuery: string;
  infiniteScrollLimit: number;
  batchEditing: boolean;
  batchSelections: BatchSelectionType;
  clipboard?: string;
}

type Action = { type: string; payload?: any };
// | { type: REQUEST_LOGIN }
// | { type: COMPLETE_LOGIN }
// | { type: CHANGE_LINK_LAYOUT, payload: LinkLayoutType };

const initialState: UserInterfaceStateType = {
  loggingIn: false,
  linkLayout: LinkLayout.LIST_LAYOUT,
  tagsLayout: TagsLayout.CHAOS_LAYOUT,
  archiveState: ArchiveState.NO_ARCHIVE,
  searchQuery: '',
  infiniteScrollLimit: 15,
  batchEditing: false,
  batchSelections: {},
};

const links = (
  state: UserInterfaceStateType = initialState,
  action: Action
): UserInterfaceStateType => {
  switch (action.type) {
    case REQUEST_LOGIN:
      return { ...state, loggingIn: true };
    case COMPLETE_LOGIN:
      return { ...state, loggingIn: false };
    case REQUEST_LOGOUT:
      return { ...state, loggingIn: true }; // abusing loggingIn for logout too
    case CHANGE_LINK_LAYOUT:
      return { ...state, linkLayout: action.payload };
    case CHANGE_TAGS_LAYOUT:
      return { ...state, tagsLayout: action.payload };
    case CHANGE_ARCHIVE_STATE:
      return { ...state, archiveState: action.payload };
    case CHANGE_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case INCREASE_INFINITE_SCROLL:
      return {
        ...state,
        infiniteScrollLimit: state.infiniteScrollLimit + action.payload,
      };
    case TOGGLE_BATCH_EDITING:
      return { ...state, batchEditing: !state.batchEditing };
    case SET_BATCH_SELECTED:
      return {
        ...state,
        batchSelections: {
          ...state.batchSelections,
          [action.payload.noteId]: action.payload.selected,
        },
      };
    case SET_BATCH_SELECTION:
      return { ...state, batchSelections: action.payload };
    case SET_CLIPBOARD:
      return { ...state, clipboard: action.payload };
    case CLEAR_CLIPBOARD:
      return { ...state, clipboard: undefined };
    default:
      return state;
  }
};
export default links;
