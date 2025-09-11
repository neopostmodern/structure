/* eslint global-require: off, no-console: off, promise/always-return: off */

console.log('[startup] Main started!');

import config from '@structure/config';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { updateElectronApp } from 'update-electron-app';
import path from 'path';
import MenuBuilder from './menu';

console.log('[startup] Static imports complete!');

app.commandLine.appendSwitch('--enable-features', 'OverlayScrollbar');

// see package.json
const CUSTOM_URL_PROTOCOL = 'structure';

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment = import.meta.env.DEV || __DEBUG_PROD__ === 'true';

if (isDevelopment) {
  import('electron-debug');
}

const installExtensions = async () => {
  const installer = await import('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS',
    'APOLLO_DEVELOPER_TOOLS',
  ];

  return installer.default(
      extensions.map((name) => {
        if (name in installer) {
          return installer[name]
        } else {
          console.error(`Developer extension not available for install: ${name}`);
          return null;
        }
      }).filter(installer => Boolean(installer)),
      forceDownload
    )
    .catch(console.log);
};

const handleParameters = (argv: Array<string>) => {
  const structureLink = argv[argv.length - 1];
  const structureLinkPrefix = `${CUSTOM_URL_PROTOCOL}://`;
  if (structureLink && structureLink.startsWith(structureLinkPrefix)) {
    mainWindow?.webContents.send(
      'navigate',
      structureLink.replace(structureLinkPrefix, '')
    );
  }
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  mainWindow.on('ready-to-show', async () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  mainWindow.webContents.on('did-finish-load', async () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    const cookies = await mainWindow?.webContents.session.cookies.get({});
    if (cookies.some(({ name }) => name === 'logged_in')) {
      ipcMain.emit('can-login');
    }
  });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.endsWith('/login/github') || url.endsWith('/logout')) {
      return { action: 'allow' };
    }

    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('did-create-window', (browserWindow) => {
    browserWindow.webContents.on('did-finish-load', () => {
      if (
        browserWindow.webContents.getURL().startsWith(config.WEB_FRONTEND_HOST)
      ) {
        browserWindow.close();
      }
    });
  });

  // enable toggling dev-tools for production app
  ipcMain.on('toggle-dev-tools', () => {
    mainWindow?.webContents.toggleDevTools();
  });

  ipcMain.on('restart', () => {
    console.log('Restarting application...');
    app.relaunch();
    app.exit(0);
  });

  handleParameters(process.argv);

  updateElectronApp();
};

/**
 * Add event listeners...
 */

// workaround for #182 – completely close app even on macOS when window is closed
// app.on('window-all-closed', () => {
//   // Respect the OSX convention of having the application in memory even
//   // after all windows have been closed
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

const gotSingleInstanceLock = app.requestSingleInstanceLock();
console.log('[startup] Got single instance lock', gotSingleInstanceLock)

if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, argv) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
      handleParameters(argv);
    }
  });


  (async () => {
    try {
      console.log('[startup] Will create app...');
      await app.whenReady();
      console.log('[startup] App creation OK')

      console.log('[startup] Will create window...');
      app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) {
          createWindow();
        }
      });
      await createWindow();
      console.log('[startup] Startup completed!');
    } catch (error) {
      console.error('[startup] App or window creation failed!', error)
    }
  })();
}
