import { IpcMain } from 'electron';
import { CalendarRepository } from '@sphere/data';
import { IPC_CHANNELS } from '@sphere/shared';

export function registerCalendarHandlers(ipcMain: IpcMain, calendarRepo: CalendarRepository): void {
  // Sync calendar
  ipcMain.handle(IPC_CHANNELS.CALENDAR_SYNC, async (_, userID: string, source: string, startDate: string, endDate: string) => {
    const result = await calendarRepo.syncCalendar(
      userID,
      source as 'google' | 'outlook' | 'apple',
      startDate,
      endDate
    );
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Get calendar events
  ipcMain.handle(IPC_CHANNELS.CALENDAR_GET_EVENTS, async (_, userID: string, startDate: string, endDate: string) => {
    const result = await calendarRepo.getLocalEvents(userID, startDate, endDate);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });
}