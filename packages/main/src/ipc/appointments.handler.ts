import { IpcMain } from 'electron';
import { AppointmentRepository } from '@sphere/data';
import { IPC_CHANNELS } from '@sphere/shared';

export function registerAppointmentHandlers(ipcMain: IpcMain, appointmentRepo: AppointmentRepository): void {
  // Get appointments
  ipcMain.handle(IPC_CHANNELS.APPOINTMENTS_GET, async (_, userID: string, filters?: any, pagination?: any) => {
    const result = await appointmentRepo.getAppointments(userID, filters, pagination);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Create appointment
  ipcMain.handle(IPC_CHANNELS.APPOINTMENTS_CREATE, async (_, appointmentData: any) => {
    const result = await appointmentRepo.createAppointment(appointmentData);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Update appointment
  ipcMain.handle(IPC_CHANNELS.APPOINTMENTS_UPDATE, async (_, appointmentID: string, updates: any) => {
    const result = await appointmentRepo.updateAppointment(appointmentID, updates);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });

  // Delete appointment
  ipcMain.handle(IPC_CHANNELS.APPOINTMENTS_DELETE, async (_, appointmentID: string, userID: string) => {
    const result = await appointmentRepo.deleteAppointment(appointmentID, userID);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true };
  });

  // Check conflicts
  ipcMain.handle('ipc:appointments:conflicts', async (_, userID: string, startDateTime: string, endDateTime: string, excludeID?: string) => {
    const result = await appointmentRepo.checkConflicts(userID, startDateTime, endDateTime, excludeID);
    if (result.isFailure()) {
      return { success: false, error: result.error.message };
    }
    return { success: true, data: result.value };
  });
}