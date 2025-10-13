import { contextBridge, ipcRenderer, clipboard } from 'electron';

const validIpcChannels = ['login-closed', 'can-login', 'navigate'];
type ValidIpcChannels = (typeof validIpcChannels)[number];

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    toggleDevTools() {
      ipcRenderer.send('toggle-dev-tools');
    },
    restart() {
      ipcRenderer.send('restart');
    },
    on<Args extends unknown[]>(
      channel: ValidIpcChannels,
      func: (...args: Args) => void
    ) {
      if (validIpcChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...(args as Args)));
      } else {
        console.error(
          `Channel '${channel}' is not whitelisted – event dropped.`
        );
      }
    },
    once<Args extends unknown[]>(
      channel: ValidIpcChannels,
      func: (...args: Args) => void
    ) {
      if (validIpcChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...(args as Args)));
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
