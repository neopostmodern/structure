import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    lib: {
      entry: 'src/main/preload.ts',
      fileName: '[name]',
      formats: ['es'],
    },
  },
});
