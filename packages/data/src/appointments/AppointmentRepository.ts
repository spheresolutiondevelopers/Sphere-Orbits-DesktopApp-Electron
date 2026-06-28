import { Result, AppointmentSchema } from '@sphere/shared';
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
      const result = await this.appointmentDao.getAppointments(userID, filters, pagination);
      return Result.ok(result);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async getAppointmentById(appointmentID: string, userID: string): Promise<Result<Appointment, Error>> {
    try {
      const appointment = await this.appointmentDao.getAppointmentById(appointmentID, userID);
      if (!appointment) {
        return Result.err(new Error('Appointment not found'));
      }
      return Result.ok(appointment);
    } catch (error: any) {
      return Result.err(error);
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
        return Result.err(new Error(validation.error.message));
      }

      // Validate that start is before end
      const start = new Date(appointment.startDateTime);
      const end = new Date(appointment.endDateTime);
      if (start >= end) {
        return Result.err(new Error('Start time must be before end time'));
      }

      const created = await this.appointmentDao.createAppointment(appointment);
      return Result.ok(created);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async updateAppointment(appointmentID: string, updates: Partial<Appointment>): Promise<Result<Appointment, Error>> {
    try {
      // Validate partial updates
      const validation = AppointmentSchema.partial().safeParse(updates);
      if (!validation.success) {
        return Result.err(new Error(validation.error.message));
      }

      const updated = await this.appointmentDao.updateAppointment(appointmentID, updates);
      if (!updated) {
        return Result.err(new Error('Appointment not found'));
      }
      return Result.ok(updated);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async deleteAppointment(appointmentID: string, userID: string): Promise<Result<void, Error>> {
    try {
      await this.appointmentDao.softDelete(appointmentID, userID);
      return Result.ok(undefined);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async checkConflicts(
    userID: string,
    startDateTime: string,
    endDateTime: string,
    excludeAppointmentID?: string
  ): Promise<Result<Appointment[], Error>> {
    try {
      const conflicts = await this.appointmentDao.getConflicts(
        userID,
        startDateTime,
        endDateTime,
        excludeAppointmentID
      );
      return Result.ok(conflicts);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async getAppointmentsForSync(userID: string): Promise<Result<Appointment[], Error>> {
    try {
      const appointments = await this.appointmentDao.getAppointmentsForSync(userID);
      return Result.ok(appointments);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async markAppointmentSynced(appointmentID: string): Promise<Result<void, Error>> {
    try {
      await this.appointmentDao.markSynced(appointmentID);
      return Result.ok(undefined);
    } catch (error: any) {
      return Result.err(error);
    }
  }
}