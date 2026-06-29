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
} from '@sphere/data';
import { TokenStore, OAuthClient } from '@sphere/data/src/auth';
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
  registerAuthHandlers(ipcMain, handlers.authRepo, handlers.tokenStore);
  registerTaskHandlers(ipcMain, handlers.taskRepo);
  registerAppointmentHandlers(ipcMain, handlers.appointmentRepo);
  registerEventHandlers(ipcMain, handlers.eventRepo);
  registerMeetingHandlers(ipcMain, handlers.meetingRepo);
  registerNoteHandlers(ipcMain, handlers.notesRepo);
  registerCalendarHandlers(ipcMain, handlers.calendarRepo);
  registerChatHandlers(ipcMain, handlers.chatRepo);
  registerAnalyticsHandlers(ipcMain, handlers.analyticsRepo);
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