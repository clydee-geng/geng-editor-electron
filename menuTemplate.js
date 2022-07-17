const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Store = require("electron-store");

const store = new Store();

const renderTemplate = (mainWindow) => [
  {
    label: "帮助",
    submenu: [
      {
        label: "查看输出的html",
        accelerator: "CmdOrCtrl+F1",
        click: () => {
          let htmlStrWindow = new BrowserWindow({
            width: 600,
            height: 400,
            parent: mainWindow,
            modal: true,
            autoHideMenuBar: true,
            webPreferences: {
              nodeIntegration: true,
              contextIsolation: false,
            },
          });

          mainWindow.webContents.send("getCurHtmlStr", "start");
          ipcMain.on("setCurHtmlStr", (e, m) => {
            store.set("htmlStr", m);
            const filePath = path.join(__dirname, "./src/htmlStr.html");
            htmlStrWindow.loadFile(`${filePath}`);

            // fix: object has been destroyed
            htmlStrWindow.on("close", function (event) {
              htmlStrWindow.hide();
              event.preventDefault();
            });
          });
        },
      },
      {
        label: "使用文档",
        accelerator: "CmdOrCtrl+F2",
        click: () => {
          const helpWindow = new BrowserWindow({
            width: 600,
            height: 400,
            parent: mainWindow,
            modal: true,
            autoHideMenuBar: true,
          });
          helpWindow.loadURL("https://clydee-geng.github.io/gengEditor/");
        },
      },
      {
        role: "toggleDevTools",
        label: "开发者工具",
        accelerator: "CmdOrCtrl+F12",
      },
    ],
  },
];

module.exports = renderTemplate;
