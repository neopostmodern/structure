import process from 'process';
import { sync as rimrafSync } from 'rimraf';
import webpackPaths from '../configs/webpack.paths.ts';

const args = process.argv.slice(2);
const commandMap = {
  dist: webpackPaths.distPath,
  release: webpackPaths.releasePath,
  dll: webpackPaths.dllPath,
};

args.forEach((x) => {
  const pathToRemove = commandMap[x];
  if (pathToRemove !== undefined) {
    rimrafSync(pathToRemove);
  }
});
