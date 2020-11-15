/**
 * Webpack config for production electron main process
 */

import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import rendererProdConfig from './webpack.config.renderer.prod';
// eslint-disable-next-line camelcase
import package_json from '../package.json';
import { createConfigPlugin } from './webpack.config.base'

const webpackConfig = merge.smart(rendererProdConfig, {
  target: 'web',

  entry: './app/index.tsx',

  output: {
    path: path.join(__dirname, '../web'),
    publicPath: './',
    filename: 'index.tsx',
    libraryTarget: 'var',
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: 'false',
      TARGET: 'web'
    }),
    new CopyWebpackPlugin([
      { from: path.join(__dirname, '../app/manifest.webmanifest'), to: 'manifest.webmanifest' },
      { from: path.join(__dirname, '../resources/icons/192x192.png'), to: 'icons/192x192.png' },
      { from: path.join(__dirname, '../resources/icons/256x256.png'), to: 'icons/256x256.png' },
    ]),
    new HtmlWebpackPlugin({
      title: package_json.productName,
      template: path.join(__dirname, '../app/web.html')
    })
  ],
});

if (process.env.STAGING) {
  const config = require('../server/deploy/config-staging.json');

  webpackConfig.plugins = webpackConfig.plugins.map(plugin => {
    if (plugin.definitions && plugin.definitions.BACKEND_URL) {
      return createConfigPlugin(config);
    }

    return plugin;
  })
}

export default webpackConfig;
