// @flow
import configureStoreDev from './configureStore.development';
import configureStoreProd from './configureStore.production';

const selectedConfigureStore = process.env.NODE_ENV === 'production'
  ? configureStoreProd
  : configureStoreDev;

export const { configureStore } = selectedConfigureStore;

export const { history } = selectedConfigureStore;
