/* eslint-disable global-require, @typescript-eslint/no-var-requires */
import path from 'path'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import MenuBuilder from './menu'

const CUSTOM_URL_PROTOCOL = 'structure'

let mainWindow = null

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')()
  const path = require('path')
  const p = path.join(__dirname, '..', 'app', 'node_modules')
  require('module').globalPaths.push(p)
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS',
    'APOLLO_DEVELOPER_TOOLS',
  ]

  return Promise.all(
    extensions.map((name) =>
      installer.default(installer[name].id, forceDownload),
    ),
  ).catch(console.log)
}

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const handleParameters = (argv) => {
  const structureLink = argv[1]
  const structureLinkPrefix = `${CUSTOM_URL_PROTOCOL}://`
  if (structureLink && structureLink.startsWith(structureLinkPrefix)) {
    const targetUrl = `file://${__dirname}/app.html#${structureLink.replace(
      structureLinkPrefix,
      '',
    )}`
    mainWindow.webContents.loadURL(targetUrl)
  }
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, argv) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
      handleParameters(argv)
    }
  })

  app.on('ready', async () => {
    if (process.env.NODE_ENV === 'development') {
      await installExtensions()
    }

    mainWindow = new BrowserWindow({
      show: false,
      width: 1024,
      height: 728,
      icon: path.join(__dirname, '../resources/icon.png'),
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true, // todo: seems necessary to get 'process' into app.html -- investigate
        enableRemoteModule: true,
      },
      titleBarStyle: 'hidden',
    })

    mainWindow.loadURL(`file://${__dirname}/app.html`)

    mainWindow.once('ready-to-show', () => {
      mainWindow.show()
    })

    mainWindow.show()

    mainWindow.webContents.on('did-finish-load', () => {
      if (!mainWindow) {
        throw new Error('"mainWindow" is not defined')
      }

      mainWindow.webContents.session.cookies.get({}, (error, cookies) => {
        if (cookies.some(({ name }) => name === 'logged_in')) {
          mainWindow.send('can-login')
        }
      })
    })

    mainWindow.webContents.on('new-window', (event, targetUrl) => {
      if (targetUrl.endsWith('/login/github')) {
        return
      }
      event.preventDefault()
      shell.openExternal(targetUrl)
    })

    mainWindow.on('closed', () => {
      mainWindow = null
    })

    const menuBuilder = new MenuBuilder(mainWindow)
    menuBuilder.buildMenu()

    // enable toggling dev-tools for production app
    ipcMain.on('toggle-dev-tools', () => {
      mainWindow.webContents.toggleDevTools()
    })

    ipcMain.on('restart', () => {
      console.log('Restarting application...')
      app.relaunch()
      app.exit(0)
    })

    handleParameters(process.argv)
  })
}
