import type { UserType } from '../users/userType.mts'

export type SessionContext = {
  user: UserType | null
}
