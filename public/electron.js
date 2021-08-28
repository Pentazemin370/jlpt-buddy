const electron = require('electron'),
  app = electron.app,
  BrowserWindow = electron.BrowserWindow;

const path = require('path'),
  isDev = require('electron-is-dev');
const appUrl = isDev ? 'http://localhost:3000' :
  `file://${path.join(__dirname, '../build/index.html')}`;
let mainWindow;
const createWindow = () => {
  if (!mainWindow) {
    mainWindow = new BrowserWindow({
      closable: true,
      resizable: true,
      minimizable: true,
      maximizable: true
    });
    mainWindow.setMenu(null);
    mainWindow.loadURL(appUrl);
    mainWindow.maximize();
    mainWindow.on('closed', () => mainWindow = null);
    mainWindow.webContents.setWindowOpenHandler((details) => {
      if (details.url) {
        electron.shell.openExternal(details.url);
        return { action: 'deny' };
      }

    });
  }
}

const closeApp = () => { if (process.platform !== 'darwin') { app.quit() } };

app.on('ready', createWindow);
app.on('window-all-closed', closeApp);
app.on('activate', createWindow);