const { contextBridge, ipcRenderer, clipboard } = require('electron');
const { name } = require('../../../package.json');
const { version } = require('../../package.json');
const { CHANNEL } = require('@structure/config');

const ElectronStore = require('electron-store');
const electronStore = new ElectronStore({
  projectName: CHANNEL ? `${name}-${CHANNEL}` : name,
  projectVersion: version,
});

const validIpcChannels = ['login-closed', 'can-login'];

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    toggleDevTools() {
      ipcRenderer.send('toggle-dev-tools');
    },
    restart() {
      ipcRenderer.send('restart');
    },
    on(channel, func) {
      if (validIpcChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      if (validIpcChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
  electronStore: {
    get(key, defaultValue) {
      return electronStore.get(key, defaultValue);
    },
    set(key, value) {
      return electronStore.set(key, value);
    },
  },
  clipboard: {
    readText() {
      return clipboard.readText();
    },
  },
});
