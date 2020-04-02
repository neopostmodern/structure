/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
// eslint-disable-next-line camelcase
import package_json from '../package'

export const createConfigPlugin = (config) => {
  const jsonifiedConfig = {};
  jsonifiedConfig.BACKEND_URL = JSON.stringify(config.BACKEND_URL);
  jsonifiedConfig.VERSION = JSON.stringify(package_json.version);
  return new webpack.DefinePlugin(jsonifiedConfig);
};

export default {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.js\.flow$/,
        loader: 'babel-loader'
      }
    ]
  },

  output: {
    path: path.join(__dirname, '../app'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.js.flow'],
    modules: [
      path.join(__dirname, '../app'),
      'node_modules',
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),

    new webpack.NamedModulesPlugin(),
  ],
};
