import { CLOSE_SETTINGS, OPEN_SETTINGS } from '../actions/settings'

export interface SettingsStateType {
  open: boolean
}

type Action = { type: string }

const initialState: SettingsStateType = {
  open: false,
}

export default function settings(
  state: SettingsStateType = initialState,
  action: Action,
): SettingsStateType {
  switch (action.type) {
    case OPEN_SETTINGS:
      return { ...state, open: true }
    case CLOSE_SETTINGS:
      return { ...state, open: false }
    default:
      return state
  }
}
