const { app, BrowserWindow }  = require('electron');
const isDev = require('electron-is-dev');
let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  const urlLocation = isDev ? 'http://localhost:3000' : 'https://www.clydee.cn';
  mainWindow.loadURL(urlLocation); // electron 和 react 建立联系的关键
})