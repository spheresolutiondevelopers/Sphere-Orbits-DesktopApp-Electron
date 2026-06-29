import { IpcMain } from 'electron';
import { TaskRepository } from '@sphere/data';
import { IPC_CHANNELS } from '@sphere/shared';

export function registerTaskHandlers(ipcMain: IpcMain, taskRepo: TaskRepository): void {
  // Get tasks
  ipcMain.handle(IPC_CHANNELS.TASKS_GET, async (_, userID: string, filters?: any, pagination?: any) => {
    const result = await taskRepo.getTasks(userID, filters, pagination);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Create task
  ipcMain.handle(IPC_CHANNELS.TASKS_CREATE, async (_, taskData: any) => {
    const result = await taskRepo.createTask(taskData);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Update task
  ipcMain.handle(IPC_CHANNELS.TASKS_UPDATE, async (_, taskID: string, updates: any) => {
    const result = await taskRepo.updateTask(taskID, updates);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Delete task
  ipcMain.handle(IPC_CHANNELS.TASKS_DELETE, async (_, taskID: string, userID: string) => {
    const result = await taskRepo.deleteTask(taskID, userID);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true };
  });

  // Complete task
  ipcMain.handle(IPC_CHANNELS.TASKS_COMPLETE, async (_, taskID: string, completionPercentage: number) => {
    const result = await taskRepo.updateTask(taskID, { completionPercentage });
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });
}