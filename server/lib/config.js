import config from './config.json';

for (let key in config) {
  if (process.env[key]) {
    config[key] = process.env[key];
  }
}

export default config;
