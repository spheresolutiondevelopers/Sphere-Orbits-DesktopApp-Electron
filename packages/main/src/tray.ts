import { Tray, Menu, BrowserWindow, nativeImage, app } from 'electron';
import path from 'path';

let tray: Tray | null = null;

export function setupTray(mainWindow: BrowserWindow | null): void {
  if (tray) return;

  // Use a simple icon (fallback)
  const iconPath = path.join(__dirname, '../../public/icons/icon.png');
  const icon = nativeImage.createFromPath(iconPath);
  if (icon.isEmpty()) {
    // Fallback: create a simple icon
    const fallbackIcon = nativeImage.createEmpty();
    tray = new Tray(fallbackIcon);
  } else {
    tray = new Tray(icon);
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Sphere',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          if (mainWindow.isMinimized()) mainWindow.restore();
          mainWindow.focus();
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Sphere Schedule');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }
    }
  });
}