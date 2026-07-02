import { IpcMain } from 'electron';
import {
  AuthRepository,
  TaskRepository,
  AppointmentRepository,
  EventRepository,
  MeetingRepository,
  NotesRepository,
  CalendarRepository,
  ChatRepository,
  AnalyticsRepository,
  SettingsRepository,
  TokenStore,
  OAuthClient,
} from '@sphere/data';
import { SyncService } from '../sync/SyncService';
import { registerAuthHandlers } from './auth.handler';
import { registerTaskHandlers } from './tasks.handler';
import { registerAppointmentHandlers } from './appointments.handler';
import { registerEventHandlers } from './events.handler';
import { registerMeetingHandlers } from './meetings.handler';
import { registerNoteHandlers } from './notes.handler';
import { registerCalendarHandlers } from './calendar.handler';
import { registerChatHandlers } from './chat.handler';
import { registerAnalyticsHandlers } from './analytics.handler';
import { registerSettingsHandlers } from './settings.handler';

export interface IpcHandlers {
  authRepo: AuthRepository;
  taskRepo: TaskRepository;
  appointmentRepo: AppointmentRepository;
  eventRepo: EventRepository;
  meetingRepo: MeetingRepository;
  notesRepo: NotesRepository;
  calendarRepo: CalendarRepository;
  chatRepo: ChatRepository;
  analyticsRepo: AnalyticsRepository;
  settingsRepo: SettingsRepository;
  syncService: SyncService;
  tokenStore: TokenStore;
  oauthClient: OAuthClient;
}

export function registerIpcHandlers(ipcMain: IpcMain, handlers: IpcHandlers): void {
  // Auth handlers
  registerAuthHandlers(ipcMain, handlers.authRepo, handlers.tokenStore);

  // Task handlers
  registerTaskHandlers(ipcMain, handlers.taskRepo);

  // Appointment handlers
  registerAppointmentHandlers(ipcMain, handlers.appointmentRepo);

  // Event handlers
  registerEventHandlers(ipcMain, handlers.eventRepo);

  // Meeting handlers
  registerMeetingHandlers(ipcMain, handlers.meetingRepo);

  // Note handlers
  registerNoteHandlers(ipcMain, handlers.notesRepo);

  // Calendar handlers
  registerCalendarHandlers(ipcMain, handlers.calendarRepo);

  // Chat handlers
  registerChatHandlers(ipcMain, handlers.chatRepo);

  // Analytics handlers
  registerAnalyticsHandlers(ipcMain, handlers.analyticsRepo);

  // Settings handlers
  registerSettingsHandlers(ipcMain, handlers.settingsRepo);

  // Sync handlers
  ipcMain.handle('ipc:sync:push', async (_, userID: string) => {
    return handlers.syncService.push(userID);
  });

  ipcMain.handle('ipc:sync:pull', async (_, userID: string) => {
    return handlers.syncService.pull(userID);
  });

  ipcMain.handle('ipc:sync:status', async (_, userID: string) => {
    return handlers.syncService.getStatus(userID);
  });
}