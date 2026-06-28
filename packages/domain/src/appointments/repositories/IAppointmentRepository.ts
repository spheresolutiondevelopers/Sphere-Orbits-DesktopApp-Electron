import { Result } from '@sphere/shared';
import { Appointment } from '../entities/Appointment';

export interface AppointmentFilters {
  status?: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';
  appointmentType?: 'general' | 'doctor' | 'business' | 'personal';
  startDateFrom?: string;
  startDateTo?: string;
  search?: string;
}

export interface PaginationOptions {
  limit: number;
  offset: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export interface IAppointmentRepository {
  /**
   * Gets appointments for the current user with optional filters and pagination.
   */
  getAppointments(
    userID: string,
    filters?: AppointmentFilters,
    pagination?: PaginationOptions
  ): Promise<Result<PaginatedResult<Appointment>, Error>>;

  /**
   * Gets a single appointment by ID.
   */
  getAppointmentById(appointmentID: string, userID: string): Promise<Result<Appointment, Error>>;

  /**
   * Creates a new appointment.
   */
  createAppointment(
    appointment: Omit<Appointment, 'appointmentID' | 'createdAt' | 'updatedAt'>
  ): Promise<Result<Appointment, Error>>;

  /**
   * Updates an existing appointment.
   */
  updateAppointment(
    appointmentID: string,
    updates: Partial<Appointment>
  ): Promise<Result<Appointment, Error>>;

  /**
   * Deletes an appointment (soft‑delete).
   */
  deleteAppointment(appointmentID: string, userID: string): Promise<Result<void, Error>>;

  /**
   * Checks for conflicting appointments in a given time range.
   * @returns An array of conflicting appointments.
   */
  checkConflicts(
    userID: string,
    startDateTime: string,
    endDateTime: string,
    excludeAppointmentID?: string
  ): Promise<Result<Appointment[], Error>>;

  /**
   * Gets all appointments that need to be synced.
   */
  getAppointmentsForSync(userID: string): Promise<Result<Appointment[], Error>>;

  /**
   * Marks an appointment as synced.
   */
  markAppointmentSynced(appointmentID: string): Promise<Result<void, Error>>;
}