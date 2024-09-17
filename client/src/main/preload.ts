const { contextBridge, ipcRenderer, clipboard } = require('electron');

const validIpcChannels = ['login-closed', 'can-login', 'navigate'];

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
        ipcRenderer.on(channel, (event, ...args) => {
          console.log('on', event, args);
          func(...args);
        });
      } else {
        console.error(
          `Channel '${channel}' is not whitelisted – event dropped.`
        );
      }
    },
    once(channel, func) {
      if (validIpcChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      } else {
        console.error(
          `Channel '${channel}' is not whitelisted – event dropped.`
        );
      }
    },
  },
  clipboard: {
    readText() {
      return clipboard.readText();
    },
  },
});
