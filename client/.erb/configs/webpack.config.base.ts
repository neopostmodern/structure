/**
 * Base webpack config used across other specific configs
 */

import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import { GenerateSW } from 'workbox-webpack-plugin';
import { version as projectVersion } from '../../package.json';
import { dependencies as externals } from '../../release/app/package.json';
import webpackPaths from './webpack.paths';

// compare with src/globals.d.ts
interface GlobalConfig {
  VERSION: string;
  BACKEND_URL: string;
  WEB_FRONTEND_HOST: string;
}

export const createConfigPlugin = (config) => {
  const jsonifiedConfig: GlobalConfig = {
    VERSION: JSON.stringify(projectVersion),
    BACKEND_URL: JSON.stringify(config.BACKEND_URL),
    WEB_FRONTEND_HOST: JSON.stringify(config.WEB_FRONTEND_HOST),
  };

  return new webpack.DefinePlugin(jsonifiedConfig);
};

export const createPluginsForPWA = ({
  development = false,
  additionalAssetFileNames = [],
} = {}) => {
  if (process.env.TARGET !== 'web') {
    return [];
  }
  const assetsFolderPath = path.join(__dirname, '../../assets');
  const assetFileNames = [
    'manifest.webmanifest',
    'favicon.ico',
    'icons/favicon.svg',
    'icons/favicon_256x256.png',
    'icons/maskable_192x192.png',
    'icons/maskable_512x512.png',
  ];
  return [
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: development ? 50000000 : undefined,
      exclude: [/.*htaccess/, /.*LICENSE.*/],
      navigateFallback: '/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [...assetFileNames, ...additionalAssetFileNames].map(
        (assetFileName) => {
          let fromAssetFileName;
          let toAssetFileName;
          if (Array.isArray(assetFileName)) {
            fromAssetFileName = assetFileName[0];
            toAssetFileName = assetFileName[1];
          } else {
            fromAssetFileName = assetFileName;
            toAssetFileName = assetFileName;
          }
          return {
            from: path.join(assetsFolderPath, fromAssetFileName),
            to:
              toAssetFileName.includes('/') || !toAssetFileName.startsWith('.')
                ? toAssetFileName
                : undefined, // see https://github.com/webpack-contrib/copy-webpack-plugin/issues/137#issuecomment-464339172
          };
        }
      ),
    }),
  ];
};

const configuration: webpack.Configuration = {
  externals: [...Object.keys(externals || {})],

  stats: 'errors-only',

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },

  output: {
    path: webpackPaths.srcPath,
    // https://github.com/webpack/webpack/issues/1114
    library: {
      type: 'commonjs2',
    },
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules'],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
};

export default configuration;
