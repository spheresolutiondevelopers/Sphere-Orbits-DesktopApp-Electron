import { app, BrowserWindow, ipcMain, protocol } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseClient } from '@sphere/data';
import { AuthRepository, TaskRepository, AppointmentRepository, EventRepository, MeetingRepository, NotesRepository, CalendarRepository, ChatRepository, AnalyticsRepository, SettingsRepository } from '@sphere/data';
import { TokenStore } from '@sphere/data/src/auth/TokenStore';
import { OAuthClient } from '@sphere/data/src/auth/OAuthClient';
import { registerIpcHandlers } from './ipc';
import { createMainWindow, createSettingsWindow } from './windows';
import { setupMenu } from './menu';
import { setupTray } from './tray';
import { SyncService } from './sync/SyncService';

// Determine if running in development
const isDev = process.env.NODE_ENV === 'development';
const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'sphere.db');

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;
let settingsWindow: BrowserWindow | null = null;
let dbClient: DatabaseClient;
let syncService: SyncService;

// Initialize database and services
function initServices() {
  dbClient = DatabaseClient.getInstance(dbPath);
  dbClient.connect();

  const tokenStore = new TokenStore();
  const oauthClient = new OAuthClient();

  const authRepo = new AuthRepository(dbClient, tokenStore, oauthClient, process.env.API_URL || 'http://localhost:3000/api');
  const taskRepo = new TaskRepository(dbClient, process.env.API_URL || 'http://localhost:3000/api');
  const appointmentRepo = new AppointmentRepository(dbClient);
  const eventRepo = new EventRepository(dbClient);
  const meetingRepo = new MeetingRepository(dbClient, process.env.API_URL || 'http://localhost:3000/api');
  const notesRepo = new NotesRepository(dbClient);
  const calendarRepo = new CalendarRepository(dbClient, process.env.API_URL || 'http://localhost:3000/api');
  const chatRepo = new ChatRepository(dbClient, process.env.WS_URL || 'ws://localhost:3000');
  const analyticsRepo = new AnalyticsRepository(dbClient);
  const settingsRepo = new SettingsRepository(dbClient);

  syncService = new SyncService(
    taskRepo,
    appointmentRepo,
    eventRepo,
    meetingRepo,
    notesRepo,
    settingsRepo,
    calendarRepo,
    chatRepo,
    analyticsRepo,
    process.env.API_URL || 'http://localhost:3000/api'
  );

  // Register IPC handlers
  registerIpcHandlers(ipcMain, {
    authRepo,
    taskRepo,
    appointmentRepo,
    eventRepo,
    meetingRepo,
    notesRepo,
    calendarRepo,
    chatRepo,
    analyticsRepo,
    settingsRepo,
    syncService,
    tokenStore,
    oauthClient,
  });
}

// App ready
app.whenReady().then(() => {
  initServices();

  // Create main window
  mainWindow = createMainWindow(isDev);
  mainWindow.on('closed', () => { mainWindow = null; });

  // Setup menu
  setupMenu(mainWindow);

  // Setup tray
  setupTray(mainWindow);

  // Handle second-instance (single instance)
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // Register custom protocols if needed
  protocol.registerSchemesAsPrivileged([
    { scheme: 'sphere', privileges: { secure: true, standard: true } },
  ]);
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow = createMainWindow(isDev);
  }
});

// Graceful shutdown
app.on('before-quit', async () => {
  if (dbClient) {
    dbClient.disconnect();
  }
  if (syncService) {
    await syncService.stop();
  }
});