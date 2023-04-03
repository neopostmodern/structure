import { clearApolloCache } from '../utils/cache';

export const migrations = new Map();

migrations.set(1, {
  name: 'reset-cache-for-tag-sharing_server-migration-7',
  async up() {
    clearApolloCache();
  },
  async down() {},
});

export const CURRENT_MIGRATION_VERSION = 1;
