import { version } from '../../package.json';
import { execSync } from 'child_process'

execSync(`npm version --no-git-tag-version ${version}`, { cwd: 'release/app' })
execSync('git add package.json package-lock.json', { cwd: 'release/app' })
