/* eslint global-require: 1, flowtype-errors/show-errors: 0 */
// @flow
import {
  app, BrowserWindow, ipcMain, shell
} from 'electron';
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
    .all(extensions.map(name => installer.default(installer[name].id, forceDownload)))
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
    height: 728,
    icon: '/home/neopostmodern/Code/Structure2/resources/icon.png',
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true // todo: seems necessary to get 'process' into app.html -- investigate
    },
    titleBarStyle: 'hidden'
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.show();

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    mainWindow.webContents.session.cookies.get({}, (error, cookies) => {
      if (cookies.some(({ name }) => name === 'logged_in')) {
        mainWindow.send('can-login');
      }
    });
  });

  mainWindow.webContents.on('new-window', (event, targetUrl) => {
    event.preventDefault();
    shell.openExternal(targetUrl);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // login logic
  ipcMain.on('login-modal', (event, backendUrl) => {
    let loginWindow = new BrowserWindow({
      parent: mainWindow,
      modal: true,
      show: false,
      width: 400,
      webPreferences: {
        nodeIntegration: false,
      }
    });

    const extractCookiesAndClose = () => {
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
    };

    loginWindow.loadURL(`${backendUrl}/login/github`);
    loginWindow.once('ready-to-show', () => {
      if (loginWindow.webContents.getURL().endsWith('/')) {
        extractCookiesAndClose();
      } else {
        loginWindow.show();
      }
    });
    loginWindow.webContents.on('did-get-redirect-request', (event, url) => {
      console.log('redirect', url);
      if (url.includes('login/github/callback')) {
        extractCookiesAndClose();
      }
    });
    loginWindow.on('closed', () => {
      loginWindow = null;
      mainWindow.send('login-closed');
    }, false);
  });

  // enable toggling dev-tools for production app
  ipcMain.on('toggle-dev-tools', () => {
    mainWindow.webContents.toggleDevTools();
  });

  ipcMain.on('restart', () => {
    console.log('Restarting application...');
    app.relaunch();
    app.exit(0);
  });
});
