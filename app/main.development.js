/* eslint global-require: 1, flowtype-errors/show-errors: 0 */
// @flow
import { app, BrowserWindow, ipcMain } from 'electron';
import MenuBuilder from './menu';

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS',
    'APOLLO_DEVELOPER_TOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};


app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development') {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  const url = (process.env.NODE_ENV === 'development')
    ? `http://localhost:${process.env.PORT || 1212}/dist/app.html`
    : `file://${__dirname}/dist/app.html`;
  mainWindow.loadURL(url);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  // mainWindow.webContents.on('did-finish-load', () => {
  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined');
  }
  mainWindow.show();
  mainWindow.focus();
  // });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // login logic
  ipcMain.on('login-modal', () => {
    let loginWindow = new BrowserWindow({
      parent: mainWindow,
      modal: true,
      show: false,
      width: 400,
      webPreferences: {
        nodeIntegration: false,
      }
    });
    loginWindow.loadURL('http://localhost:3001/login/github');
    loginWindow.once('ready-to-show', () => {
      loginWindow.show();
    });
    loginWindow.webContents.on('did-get-redirect-request', (event, url) => {
      if (url.includes('login/github/callback')) {
        loginWindow.webContents.session.cookies.get({}, (error, cookies) => {
          cookies.forEach((cookie) => {
            cookie.url = `http://${cookie.domain}`;
            delete cookie.domain;
            mainWindow.webContents.session.cookies.set(cookie, (error) => {
              if (error) {
                console.error("Can't set cookie.", error, error.message, error.toString());
              }
            });
          });
        });

        loginWindow.close();
        mainWindow.send('login-closed');
      }
    });
    loginWindow.on('closed', () => {
      loginWindow = null;
      mainWindow.send('login-closed');
    }, false);
  });
});
