import { IpcMain } from 'electron';
import { MeetingRepository } from '@sphere/data';
import { IPC_CHANNELS } from '@sphere/shared';

export function registerMeetingHandlers(ipcMain: IpcMain, meetingRepo: MeetingRepository): void {
  // Get meetings
  ipcMain.handle(IPC_CHANNELS.MEETINGS_GET, async (_, userID: string, filters?: any, pagination?: any) => {
    const result = await meetingRepo.getMeetings(userID, filters, pagination);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Create meeting
  ipcMain.handle(IPC_CHANNELS.MEETINGS_CREATE, async (_, meetingData: any) => {
    const result = await meetingRepo.createMeeting(meetingData);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Update meeting
  ipcMain.handle(IPC_CHANNELS.MEETINGS_UPDATE, async (_, meetingID: string, updates: any) => {
    const result = await meetingRepo.updateMeeting(meetingID, updates);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Delete meeting
  ipcMain.handle(IPC_CHANNELS.MEETINGS_DELETE, async (_, meetingID: string, userID: string) => {
    const result = await meetingRepo.deleteMeeting(meetingID, userID);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true };
  });

  // Join meeting
  ipcMain.handle('ipc:meetings:join', async (_, meetingID: string, userID: string, email: string, name: string) => {
    const result = await meetingRepo.joinMeeting(meetingID, userID, email, name);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });
}