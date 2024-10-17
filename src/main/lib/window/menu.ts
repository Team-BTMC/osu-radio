import { Menu, type MenuItemConstructorOptions } from "electron";

export default function createMenu() {
  const menuTemplate: MenuItemConstructorOptions[] = [
    { role: "fileMenu" },
    { role: "editMenu" },
    {
      role: "viewMenu",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomIn", accelerator: "CommandOrControl+=", visible: false },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    { role: "windowMenu" },
    { role: "help" },
  ];

  if (process.platform === "darwin") {
    menuTemplate.unshift({ role: "appMenu" });
  }

  return Menu.buildFromTemplate(menuTemplate);
}
