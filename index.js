const { app, shell, BrowserWindow, ipcMain } = require('electron/main')

const { join } = require('path')
const { electronApp, optimizer } = require('@electron-toolkit/utils')

require("./server");  // This runs the Express app in the same process

let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 770,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    doInjectScrollBar()
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.setContentProtection(true);

  mainWindow.loadURL("http://localhost:3000");
}

function doInjectScrollBar() {
  const cddData = `
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    ::-webkit-scrollbar-track {
        background: #2a2a2a;
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #555555;
        border-radius: 10px;
        border: 2px solid #2a2a2a;
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: #777777;
    }`

  mainWindow.webContents.insertCSS(cddData)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
