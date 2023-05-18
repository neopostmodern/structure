/**
 * Build config for electron renderer process
 */

import config from '@structure/config';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';
import checkNodeEnv from '../scripts/check-node-env';
import deleteSourceMaps from '../scripts/delete-source-maps';
import baseConfig, {
  createConfigPlugin,
  createPluginsForPWA,
} from './webpack.config.base';
import webpackPaths from './webpack.paths';

const configPlugin = createConfigPlugin(config);

checkNodeEnv('production');
deleteSourceMaps();

const devtoolsConfig =
  process.env.DEBUG_PROD === 'true'
    ? {
        devtool: 'source-map',
      }
    : {};

const configuration: webpack.Configuration = {
  ...devtoolsConfig,

  mode: 'production',

  target:
    process.env.TARGET === 'web'
      ? 'browserslist:defaults'
      : ['web', 'electron-renderer'],

  entry: {
    main: path.join(webpackPaths.srcRendererPath, 'index.tsx'),
  },

  output: {
    path:
      process.env.TARGET === 'web'
        ? webpackPaths.distWebPath
        : webpackPaths.distRendererPath,
    publicPath: process.env.TARGET === 'web' ? '/' : './',
    filename:
      process.env.TARGET === 'web' ? '[name].[chunkhash].js' : 'renderer.js',
    library: {
      type: 'umd',
    },
  },

  resolve: {
    alias: {
      '@mui/styled-engine': '@mui/styled-engine-sc',
    },
  },

  module: {
    rules: [
      {
        test: /\.s?(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
            },
          },
          'sass-loader',
        ],
        include: /\.module\.s?(c|a)ss$/,
      },
      {
        test: /\.s?(a|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        exclude: /\.module\.s?(c|a)ss$/,
      },
      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      // Images
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
      new CssMinimizerPlugin(),
    ],
    ...(process.env.TARGET === 'web'
      ? {
          runtimeChunk: true,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              markdown: {
                test: /[\\/]node_modules[\\/].*(markdown|gfm|remark|rehype|parse5|micromark|hast|property-information).*[\\/]/,
                name: 'vendors-markdown',
                chunks: 'all',
                priority: 2,
              },
              react: {
                test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                name: 'vendors-react',
                chunks: 'all',
                priority: 1,
              },
            },
          },
        }
      : {}),
  },

  plugins: [
    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG_PROD: false,
      TARGET: process.env.TARGET,
    }),

    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE === 'true' ? 'server' : 'disabled',
    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(webpackPaths.srcRendererPath, 'index.ejs'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
      isBrowser: false,
      isDevelopment: process.env.NODE_ENV !== 'production',
    }),

    configPlugin,

    ...createPluginsForPWA({
      additionalAssetFileNames: [
        '.htaccess',
        [
          config.CHANNEL === 'staging'
            ? '.well-known/assetlinks-staging.json'
            : '.well-known/assetlinks-prod.json',
          '.well-known/assetlinks.json',
        ],
      ],
    }),
  ],
};

export default merge(baseConfig, configuration);
