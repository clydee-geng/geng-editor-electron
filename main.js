const { app, BrowserWindow, Menu } = require("electron");
const isDev = require("electron-is-dev");
const renderMenuTemplate = require("./menuTemplate.js");
const electronRemote = require("@electron/remote/main");
const path = require("path");

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  const urlLocation = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "./build/index.html")}`;
  mainWindow.loadURL(urlLocation); // electron 和 react 建立联系的关键

  // 设置 原生menu
  const menu = Menu.buildFromTemplate(renderMenuTemplate(mainWindow));
  Menu.setApplicationMenu(menu);

  electronRemote.initialize();
  electronRemote.enable(mainWindow.webContents);
});
