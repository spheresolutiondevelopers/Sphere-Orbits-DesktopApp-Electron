import { type Result } from '@sphere/shared';
import { IAppointmentRepository } from '../repositories/IAppointmentRepository';
import { Appointment } from '../entities/Appointment';
export interface BookAppointmentInput {
    userID: string;
    title: string;
    startDateTime: string;
    endDateTime: string;
    appointmentType?: 'general' | 'doctor' | 'business' | 'personal';
    description?: string | null;
    location?: string | null;
    isVirtual?: boolean;
    meetingLink?: string | null;
    meetingPlatform?: string | null;
    allDayEvent?: boolean;
    reminderMinutesBefore?: number;
    isRecurring?: boolean;
    recurrencePattern?: string | null;
    calendarColor?: string;
    notes?: string | null;
}
export declare class BookAppointmentUseCase {
    private readonly appointmentRepo;
    constructor(appointmentRepo: IAppointmentRepository);
    execute(input: BookAppointmentInput): Promise<Result<Appointment, Error>>;
}
//# sourceMappingURL=BookAppointmentUseCase.d.ts.map