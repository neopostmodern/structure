import path from 'path';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';

export default {
  input: 'lib/server.js',
  output: {
    format: 'cjs',
    file: 'dist/server.js',
  },
  external: [
    path.resolve(__dirname, 'lib/config.js')
  ],
  plugins: [
    json(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
};
