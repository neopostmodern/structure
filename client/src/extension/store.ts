import { RootState } from '../renderer/reducers'
import { SettingsStateType } from './reducers/settings'

export type ExtensionRootState = RootState & { settings: SettingsStateType }
