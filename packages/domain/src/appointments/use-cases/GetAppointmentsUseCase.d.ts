import { type Result } from '@sphere/shared';
import { IAppointmentRepository, AppointmentFilters, PaginationOptions, PaginatedResult } from '../repositories/IAppointmentRepository';
import { Appointment } from '../entities/Appointment';
export declare class GetAppointmentsUseCase {
    private readonly appointmentRepo;
    constructor(appointmentRepo: IAppointmentRepository);
    execute(userID: string, filters?: AppointmentFilters, pagination?: PaginationOptions): Promise<Result<PaginatedResult<Appointment>, Error>>;
}
//# sourceMappingURL=GetAppointmentsUseCase.d.ts.map