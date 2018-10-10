import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import run from 'rollup-plugin-run';

export default {
  input: 'lib/server.js',
  output: {
    format: 'cjs',
    file: 'lib/server_rollup.js',
  },
  plugins: [
    json(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    run()
  ]
};
