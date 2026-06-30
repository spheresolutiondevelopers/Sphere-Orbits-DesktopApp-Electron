import { err, type Result } from '@sphere/shared';
import {
  IAppointmentRepository,
  AppointmentFilters,
  PaginationOptions,
  PaginatedResult,
} from '../repositories/IAppointmentRepository';
import { Appointment } from '../entities/Appointment';

export class GetAppointmentsUseCase {
  constructor(private readonly appointmentRepo: IAppointmentRepository) {}

  async execute(
    userID: string,
    filters?: AppointmentFilters,
    pagination?: PaginationOptions
  ): Promise<Result<PaginatedResult<Appointment>, Error>> {
    if (!userID) {
      return err(new Error('userID is required'));
    }
    return this.appointmentRepo.getAppointments(userID, filters, pagination);
  }
}