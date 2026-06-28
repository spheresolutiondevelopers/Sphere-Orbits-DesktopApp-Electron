import { BrowserWindow, BrowserWindowConstructorOptions, screen } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createMainWindow(isDev: boolean): BrowserWindow {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const options: BrowserWindowConstructorOptions = {
    width: Math.min(1400, width * 0.9),
    height: Math.min(900, height * 0.9),
    minWidth: 800,
    minHeight: 600,
    title: 'Sphere Schedule',
    backgroundColor: '#0F0E1C',
    icon: path.join(__dirname, '../../public/icons/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, '../../preload/dist/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    show: false, // Show only when ready
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
    const indexPath = path.join(__dirname, '../../renderer/dist/index.html');
    win.loadFile(indexPath);
  }

  win.on('ready-to-show', () => {
    win.show();
    win.focus();
  });

  win.on('closed', () => {
    // Cleanup
  });

  return win;
}