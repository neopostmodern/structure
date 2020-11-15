module.exports = (api) => {
  // todo: improve
  api.cache(false)

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: { electron: require('electron/package.json').version },
          useBuiltIns: 'usage',
          corejs: 3,
        },
      ],
      '@babel/react',
      '@babel/preset-typescript',
    ],
    // overrides: [
    //   {
    //     test: ['./app/**/*.ts', './app/**/*.tsx'],
    //     presets: [
    //       [
    //         '@babel/preset-env',
    //         {
    //           modules: 'cjs',
    //           targets: {
    //             electron: require('electron/package.json').version,
    //           },
    //         },
    //       ],
    //       '@babel/preset-react',
    //       '@babel/preset-typescript',
    //     ],
    //   },
    // ],
    plugins: ['add-module-exports', '@babel/plugin-transform-modules-commonjs'],
    env: {
      production: {
        plugins: [
          'dev-expression',
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
          '@babel/plugin-transform-classes',
          '@babel/plugin-transform-react-constant-elements',
          '@babel/plugin-transform-react-inline-elements',
          'babel-plugin-transform-react-remove-prop-types',
        ],
      },
      development: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
          '@babel/plugin-transform-classes',
        ],
      },
    },
  }
}
