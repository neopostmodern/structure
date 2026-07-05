import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import config from '@structure/config';
import packageJson from './package.json' with { type: 'json' };
import viteElectronRendererConfig from './vite.renderer.config.js';

// manifest.json can't go through Vite's `define` substitution (it's not
// JS/TS), so it ships as a template with placeholders that get filled in
// here from the same config/package.json values the other build targets use.
const writeManifest = (): Plugin => ({
  name: 'write-extension-manifest',
  closeBundle() {
    const template = readFileSync(
      resolve(__dirname, 'src/extension/manifest.json'),
      'utf-8',
    );
    const manifest = template
      .replaceAll('__VERSION__', packageJson.version)
      .replaceAll('__BACKEND_URL__', config.BACKEND_URL);

    writeFileSync(resolve(__dirname, 'out/extension/manifest.json'), manifest);
  },
});

// https://vitejs.dev/config
export default defineConfig({
  ...viteElectronRendererConfig,
  publicDir: './assets/',
  build: {
    ...viteElectronRendererConfig.build,
    outDir: './out/extension',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        // manifest.json's background.service_worker needs a stable, exact
        // filename, unlike popup.html's script tag which Vite manages itself
        background: resolve(__dirname, 'src/extension/background.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) =>
          chunkInfo.name === 'background'
            ? 'background.js'
            : 'assets/[name]-[hash].js',
      },
    },
  },
  define: {
    ...viteElectronRendererConfig.define,
    __BUILD_TARGET__: '"extension"',
  },
  plugins: [...viteElectronRendererConfig.plugins!, writeManifest()],
});
