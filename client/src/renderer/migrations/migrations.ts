import { clearApolloCache } from '../utils/cache'

export const migrations = new Map()

migrations.set(1, {
  name: 'reset-cache-for-tag-sharing_server-migration-7',
  async up() {
    clearApolloCache()
  },
  async down() {},
})
migrations.set(2, {
  name: 'reset-cache-and-localstorage-after-cache-bug-fixed',
  async up() {
    clearApolloCache()
    localStorage.clear()
  },
  async down() {},
})

export const CURRENT_MIGRATION_VERSION = 2
