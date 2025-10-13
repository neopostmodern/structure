import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  define: {
    __DEBUG_PROD__: Boolean(process.env.DEBUG_PROD),
  },
  build: {
    lib: {
      entry: 'src/main/main.ts',
      fileName: '[name]',
      formats: ['es']
    }
  }
});
