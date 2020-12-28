/**
 * Base webpack config used across other specific configs
 */

import path from 'path'
import webpack from 'webpack'
// eslint-disable-next-line camelcase
import package_json from '../package'

export const createConfigPlugin = (config) => {
  const jsonifiedConfig = {}
  jsonifiedConfig.BACKEND_URL = JSON.stringify(config.BACKEND_URL)
  jsonifiedConfig.VERSION = JSON.stringify(package_json.version)
  return new webpack.DefinePlugin(jsonifiedConfig)
}

const fontTypes = [
  // WOFF Font
  {
    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
    mimetype: 'font/woff',
  },
  // WOFF2 Font
  {
    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
    mimetype: 'woff/woff2',
  },
  // TTF Font
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    mimetype: 'application/octet-stream',
  },
  // EOT Font
  {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    mimetype: 'application/vnd.ms-fontobject',
  },
  // SVG Font
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    mimetype: 'image/svg+xml',
  },
]

const fontRuleGenerator = ({ test, mimetype, publicPath = undefined }) => ({
  test,
  loader: 'file-loader',
  options: {
    mimetype,
    publicPath,
  },
})

export const fontRules = ({ publicPath = undefined } = {}) =>
  fontTypes.map(({ test, mimetype }) =>
    fontRuleGenerator({ test, mimetype, publicPath }),
  )

export default {
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.js\.flow$/,
        loader: 'babel-loader',
      },
    ],
  },

  output: {
    path: path.join(__dirname, '../app'),
    libraryTarget: 'umd',
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    modules: [path.join(__dirname, '../app'), 'node_modules'],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
}
