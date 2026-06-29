import { IpcMain } from 'electron';
import { EventRepository } from '@sphere/data';
import { IPC_CHANNELS } from '@sphere/shared';

export function registerEventHandlers(ipcMain: IpcMain, eventRepo: EventRepository): void {
  // Get events
  ipcMain.handle(IPC_CHANNELS.EVENTS_GET, async (_, userID: string, filters?: any, pagination?: any) => {
    const result = await eventRepo.getEvents(userID, filters, pagination);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Create event
  ipcMain.handle(IPC_CHANNELS.EVENTS_CREATE, async (_, eventData: any) => {
    const result = await eventRepo.createEvent(eventData);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Update event
  ipcMain.handle(IPC_CHANNELS.EVENTS_UPDATE, async (_, eventID: string, updates: any) => {
    const result = await eventRepo.updateEvent(eventID, updates);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Delete event
  ipcMain.handle(IPC_CHANNELS.EVENTS_DELETE, async (_, eventID: string, userID: string) => {
    const result = await eventRepo.deleteEvent(eventID, userID);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true };
  });
}