import { IpcMain } from 'electron';
import { NotesRepository } from '@sphere/data';
import { IPC_CHANNELS } from '@sphere/shared';

export function registerNoteHandlers(ipcMain: IpcMain, notesRepo: NotesRepository): void {
  // Get notes
  ipcMain.handle(IPC_CHANNELS.NOTES_GET, async (_, userID: string, filters?: any, pagination?: any) => {
    const result = await notesRepo.getNotes(userID, filters, pagination);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Create note
  ipcMain.handle(IPC_CHANNELS.NOTES_CREATE, async (_, noteData: any) => {
    const result = await notesRepo.createNote(noteData);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Update note
  ipcMain.handle(IPC_CHANNELS.NOTES_UPDATE, async (_, noteID: string, updates: any) => {
    const result = await notesRepo.updateNote(noteID, updates);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Delete note
  ipcMain.handle(IPC_CHANNELS.NOTES_DELETE, async (_, noteID: string, userID: string) => {
    const result = await notesRepo.deleteNote(noteID, userID);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true };
  });
}