import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  define: {
    __DEBUG_PROD__: Boolean(process.env.DEBUG_PROD),
  },
});
