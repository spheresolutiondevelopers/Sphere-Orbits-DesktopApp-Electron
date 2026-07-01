import { BrowserWindow, BrowserWindowConstructorOptions, screen } from 'electron';
import path from 'path';

export function createMainWindow(isDev: boolean): BrowserWindow {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const options: BrowserWindowConstructorOptions = {
    width: Math.min(1400, width * 0.9),
    height: Math.min(900, height * 0.9),
    minWidth: 800,
    minHeight: 600,
    title: 'Sphere Schedule',
    backgroundColor: '#0F0E1C',
    icon: path.join(process.cwd(), 'public/icons/icon.png'),
    webPreferences: {
      preload: path.join(process.cwd(), 'packages/preload/dist/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    show: false,
    frame: true,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 18 },
  };

  const win = new BrowserWindow(options);

  // Load the renderer
  if (isDev) {
    const devUrl = process.env.RENDERER_DEV_URL || 'http://localhost:5173';
    win.loadURL(devUrl);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    const indexPath = path.join(process.cwd(), 'packages/renderer/dist/index.html');
    win.loadFile(indexPath);
  }

  win.on('ready-to-show', () => {
    win.show();
    win.focus();
  });

  return win;
}