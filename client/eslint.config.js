import { defineConfig } from 'eslint/config'
import gts from 'gts'

export default defineConfig([
  ...gts,
  // {
  //   parserOptions: {
  //     ecmaVersion: 2020,
  //     sourceType: 'module',
  //     project: true,
  //     tsconfigRootDir: import.meta.dirname,
  //     createDefaultProgram: true,
  //   },
  //   settings: {
  //     'import/parsers': {
  //       '@typescript-eslint/parser': ['.ts', '.tsx'],
  //     },
  //   },
  // },
])
