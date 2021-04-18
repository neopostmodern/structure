/**
 * Webpack config for production electron main process
 */

import path from 'path'
import webpack from 'webpack'
import { mergeWithRules } from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { GenerateSW } from 'workbox-webpack-plugin'

import rendererProdConfig from './webpack.config.renderer.prod.babel'
import { createConfigPlugin } from './webpack.config.base.babel'
import { fileCopyPatterns } from './webpack.config.web.prod.babel'
// eslint-disable-next-line camelcase
import package_json from '../package.json'
import config from '../server/lib/config.json'

const port = 8000
const publicPath = `http://localhost:${port}/` // `http://192.168.1.42:${port}/`

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
        patterns: fileCopyPatterns,
      }),
      new HtmlWebpackPlugin({
        title: package_json.productName,
        template: path.join(__dirname, '../app/web.html'),
      }),
      new MiniCssExtractPlugin({
        filename: 'style.css',
      }),
      configPlugin,
      new GenerateSW()
    ],

    devServer: {
      port,
      publicPath,
      historyApiFallback: true,
    },
  },
)

export default webpackConfig
