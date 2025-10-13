import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import config from '@structure/config';
import packageJson from './package.json' with { type: "json" };

// https://vitejs.dev/config
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@mui/styled-engine', replacement: '@mui/styled-engine-sc' },
    ],
  },
  define: {
    __DEBUG_PROD__: Boolean(process.env.DEBUG_PROD),
    __BUILD_TARGET__: '"electron_renderer"',
    // config
    __BACKEND_URL__: JSON.stringify(config.BACKEND_URL),
    __WEB_FRONTEND_HOST__: JSON.stringify(config.WEB_FRONTEND_HOST),
    // package.json
    __VERSION__: JSON.stringify(packageJson.version),
  },
});
