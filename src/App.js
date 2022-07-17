import React from "react";
import GengEditor from "geng-editor";
import "geng-editor/dist/gengEditor.css";

const { ipcRenderer } = window.require("electron");
const { getCurrentWindow, Menu, MenuItem, clipboard } =
  window.require("@electron/remote");

const App = () => {
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    const contextmenuHandle = (e) => {
      const menu = new Menu();

      const el = document.activeElement; // 焦点元素
      const selectStr = getSelection(); // 选中的内容
      const text = e.target.innerText || ""; // 目标标签的innerText
      const value = e.target.value || ""; // 目标标签的value

      if (el.className.includes("public-DraftEditor-content")) {
        if (selectStr) {
          if (
            text.indexOf(selectStr) !== -1 ||
            value.indexOf(selectStr) !== -1
          ) {
            menu.append(new MenuItem({ label: "复制文本", click: copyString }));
          }
        }

        if (selectStr) {
          menu.popup({ window: getCurrentWindow() });
        }
      }
    };
    window.addEventListener("contextmenu", contextmenuHandle);
    return () => {
      window.removeEventListener("contextmenu", contextmenuHandle);
    };
  }, []);

  React.useEffect(() => {
    ipcRenderer.on("getCurHtmlStr", ipcRendererCB);
    return () => {
      ipcRenderer.off("getCurHtmlStr", ipcRendererCB);
    };
  }, [value]);

  const ipcRendererCB = (e, m) => {
    ipcRenderer.send("setCurHtmlStr", value);
  };

  // 写入剪贴板方法
  const copyString = () => {
    const str = getSelection(); // 获取选中内容
    clipboard.writeText(str); // 写入剪贴板
  };

  // 获取选中内容
  const getSelection = () => {
    var text = "";
    if (window.getSelection) {
      // 除IE9以下 之外的浏览器
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type !== "Control") {
      //IE9以下，可不考虑
      text = document.selection.createRange().text;
    }
    if (text) {
      return text;
    }
  };

  return (
    <div style={{ padding: 10, height: "100vh" }}>
      <GengEditor
        value={value}
        onChange={(e) => {
          setValue(e);
        }}
      />
    </div>
  );
};

export default App;
