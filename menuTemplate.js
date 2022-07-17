const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

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
            show: false,
            parent: mainWindow,
            modal: true,
            autoHideMenuBar: true,
          });

          mainWindow.webContents.send("getCurHtmlStr", "start");
          ipcMain.on("setCurHtmlStr", (e, m) => {
            const filePath = path.join(__dirname, "./src/htmlStr.html");
            console.log(m);
            const fileContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>输出的htmlStr</title>
</head>
<body style="padding: 10px">
  <h3>预览：</h3>
  <div style="border: 1px solid #eee; padding: 10px">
    ${m}
  </div>
  <h3 style="margin-top: 10px;">源码：</h3>
  <div style="background: #eee; padding: 10px">
    <xmp>${m}</xmp>
  </div>
  <script>
  </script>
</body>
</html>
`;
            fs.writeFileSync(filePath, fileContent, "utf8");
            htmlStrWindow.loadFile(`${filePath}`);
            htmlStrWindow.once("ready-to-show", () => {
              htmlStrWindow.show();
            });

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
            show: false,
            parent: mainWindow,
            modal: true,
            autoHideMenuBar: true,
          });
          helpWindow.loadURL("https://clydee-geng.github.io/gengEditor/");
          helpWindow.once("ready-to-show", () => {
            helpWindow.show();
          });
        },
      },
      { role: "toggleDevTools", label: "开发者工具" },
    ],
  },
];

module.exports = renderTemplate;
