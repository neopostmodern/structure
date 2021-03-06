module.exports = (api) => {
  // todo: improve
  api.cache(false)

  return {
    presets: [
      ['@babel/preset-env'],
      '@babel/react',
      '@babel/preset-typescript',
    ],
    plugins: ['add-module-exports'],
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
