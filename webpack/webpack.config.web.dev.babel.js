/**
 * Webpack config for production electron main process
 */

import path from 'path'
import webpack from 'webpack'
import { mergeWithRules } from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import rendererProdConfig from './webpack.config.renderer.prod.babel'
import { createConfigPlugin } from './webpack.config.base.babel'
// eslint-disable-next-line camelcase
import package_json from '../package.json'
import config from '../server/lib/config.json'

const port = 3000
const publicPath = `http://localhost:${port}/`

const configPlugin = createConfigPlugin(config)

const webpackConfig = mergeWithRules({ plugins: 'replace' })(
  rendererProdConfig,
  {
    target: 'web',

    entry: './app/index.tsx',

    output: {
      publicPath,
      filename: 'index.js',
    },

    plugins: [
      new webpack.EnvironmentPlugin({
        TARGET: 'web',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(__dirname, '../resources/icon.ico'),
            to: 'favicon.ico',
          },
        ],
      }),
      new HtmlWebpackPlugin({
        title: package_json.productName,
        template: path.join(__dirname, '../app/web.html'),
      }),
      new MiniCssExtractPlugin({
        filename: 'style.css',
      }),
      configPlugin,
    ],

    devServer: {
      port,
      publicPath,
      historyApiFallback: true,
    },
  },
)

export default webpackConfig
