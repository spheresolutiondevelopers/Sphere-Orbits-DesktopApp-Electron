import { Menu, BrowserWindow, shell } from 'electron';

export function setupMenu(mainWindow: BrowserWindow | null): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        { role: 'newWindow' },
        { type: 'separator' },
        { role: 'close' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'windowMenu' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click: () => shell.openExternal('https://sphere.app'),
        },
        {
          label: 'Documentation',
          click: () => shell.openExternal('https://docs.sphere.app'),
        },
        { type: 'separator' },
        {
          label: 'About Sphere',
          click: () => {
            // Show about dialog
            const { dialog, app } = require('electron');
            dialog.showMessageBox({
              title: 'About Sphere',
              message: `Sphere Schedule\nVersion ${app.getVersion()}`,
              detail: '© 2026 Sphere Solution Developers\nAll rights reserved.',
              type: 'info',
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}