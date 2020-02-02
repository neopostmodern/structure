/**
 * Webpack config for production electron main process
 */

import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import rendererProdConfig from './webpack.config.renderer.prod';
import package_json from './package.json';

const port = 3000;
const publicPath = `http://localhost:${port}/`;

export default merge.smart(rendererProdConfig, {
  target: 'web',

  entry: './app/index.js',

  output: {
    publicPath,
    filename: 'index.js',
    libraryTarget: 'var',
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      TARGET: 'web'
    }),
    new CopyWebpackPlugin([
      { from: path.join(__dirname, 'resources/icon.ico'), to: 'favicon.ico' },
    ]),
    new HtmlWebpackPlugin({
      title: package_json.productName,
      template: path.join(__dirname, 'app/web.html')
    })
  ],

  devServer: {
    port,
    publicPath,
    historyApiFallback: true
  }
});
