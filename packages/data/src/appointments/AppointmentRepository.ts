import { ok, err, type Result, AppointmentSchema } from '@sphere/shared';
import { Appointment, IAppointmentRepository, AppointmentFilters, PaginationOptions, PaginatedResult } from '@sphere/domain';
import { DatabaseClient } from '../database/DatabaseClient';
import { AppointmentDao } from './local/AppointmentDao';

export class AppointmentRepository implements IAppointmentRepository {
  private appointmentDao: AppointmentDao;

  constructor(db: DatabaseClient) {
    this.appointmentDao = new AppointmentDao(db);
  }

  async getAppointments(
    userID: string,
    filters?: AppointmentFilters,
    pagination?: PaginationOptions
  ): Promise<Result<PaginatedResult<Appointment>, Error>> {
    try {
      const result = this.appointmentDao.getAppointments(userID, filters, pagination);
      return ok(result);
    } catch (error: any) {
      return err(error);
    }
  }

  async getAppointmentById(appointmentID: string, userID: string): Promise<Result<Appointment, Error>> {
    try {
      const appointment = this.appointmentDao.getAppointmentById(appointmentID, userID);
      if (!appointment) {
        return err(new Error('Appointment not found'));
      }
      return ok(appointment);
    } catch (error: any) {
      return err(error);
    }
  }

  async createAppointment(
    appointment: Omit<Appointment, 'appointmentID' | 'createdAt' | 'updatedAt'>
  ): Promise<Result<Appointment, Error>> {
    try {
      // Validate with Zod
      const validation = AppointmentSchema.omit({
        appointmentID: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
        userID: true,
      }).safeParse(appointment);
      if (!validation.success) {
        return err(new Error(validation.error.message));
      }

      // Validate that start is before end
      const start = new Date(appointment.startDateTime);
      const end = new Date(appointment.endDateTime);
      if (start >= end) {
        return err(new Error('Start time must be before end time'));
      }

      const created = this.appointmentDao.createAppointment(appointment);
      return ok(created);
    } catch (error: any) {
      return err(error);
    }
  }

  async updateAppointment(appointmentID: string, updates: Partial<Appointment>): Promise<Result<Appointment, Error>> {
    try {
      // Validate partial updates
      const validation = AppointmentSchema.partial().safeParse(updates);
      if (!validation.success) {
        return err(new Error(validation.error.message));
      }

      const updated = this.appointmentDao.updateAppointment(appointmentID, updates);
      if (!updated) {
        return err(new Error('Appointment not found'));
      }
      return ok(updated);
    } catch (error: any) {
      return err(error);
    }
  }

  async deleteAppointment(appointmentID: string, userID: string): Promise<Result<void, Error>> {
    try {
      this.appointmentDao.softDelete(appointmentID, userID);
      return ok(undefined);
    } catch (error: any) {
      return err(error);
    }
  }

  async checkConflicts(
    userID: string,
    startDateTime: string,
    endDateTime: string,
    excludeAppointmentID?: string
  ): Promise<Result<Appointment[], Error>> {
    try {
      const conflicts = this.appointmentDao.getConflicts(
        userID,
        startDateTime,
        endDateTime,
        excludeAppointmentID
      );
      return ok(conflicts);
    } catch (error: any) {
      return err(error);
    }
  }

  async getAppointmentsForSync(userID: string): Promise<Result<Appointment[], Error>> {
    try {
      const appointments = this.appointmentDao.getAppointmentsForSync(userID);
      return ok(appointments);
    } catch (error: any) {
      return err(error);
    }
  }

  async markAppointmentSynced(appointmentID: string): Promise<Result<void, Error>> {
    try {
      this.appointmentDao.markSynced(appointmentID);
      return ok(undefined);
    } catch (error: any) {
      return err(error);
    }
  }
}