import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import viteElectronRendererConfig from './vite.renderer.config.js';

// https://vitejs.dev/config
export default defineConfig({
  ...viteElectronRendererConfig,
  publicDir: './assets/',
  build: {
    ...viteElectronRendererConfig.build,
    outDir: './out/web',
  },
  define: {
    ...viteElectronRendererConfig.define,
    __BUILD_TARGET__: '"web"',
  },
  server: {
    ...viteElectronRendererConfig.server,
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    ...viteElectronRendererConfig.plugins!,
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{html,js,css,ico,png,svg,woff2}'],
      },
      manifest: false,
    }),
  ],
});
