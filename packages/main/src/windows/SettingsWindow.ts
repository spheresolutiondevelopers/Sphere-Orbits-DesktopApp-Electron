import { app, BrowserWindow, BrowserWindowConstructorOptions, screen } from 'electron';
import path from 'path';

export function createSettingsWindow(parentWindow: BrowserWindow | null): BrowserWindow {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const appPath = app.getAppPath();

  const options: BrowserWindowConstructorOptions = {
    width: Math.min(600, width * 0.6),
    height: Math.min(700, height * 0.7),
    minWidth: 500,
    minHeight: 500,
    parent: parentWindow || undefined,
    modal: true,
    title: 'Settings – Sphere',
    backgroundColor: '#0F0E1C',
    icon: path.join(appPath, 'public/icons/icon.png'),
    webPreferences: {
      preload: path.join(appPath, 'packages/preload/dist/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    show: false,
  };

  const win = new BrowserWindow(options);

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    const devUrl = process.env.RENDERER_DEV_URL || 'http://localhost:5173/#/settings';
    win.loadURL(devUrl);
  } else {
    const indexPath = path.join(appPath, 'packages/renderer/dist/index.html');
    win.loadFile(indexPath, { hash: 'settings' });
  }

  win.on('ready-to-show', () => {
    win.show();
  });

  return win;
}