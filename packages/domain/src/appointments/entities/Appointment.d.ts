import { Appointment as AppointmentDTO } from '@sphere/shared';
export declare class Appointment {
    readonly appointmentID: string;
    userID: string;
    title: string;
    appointmentType: 'general' | 'doctor' | 'business' | 'personal';
    startDateTime: string;
    endDateTime: string;
    allDayEvent: boolean;
    isVirtual: boolean;
    status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';
    reminderMinutesBefore: number;
    isRecurring: boolean;
    externalSyncStatus: 'not_synced' | 'synced' | 'failed';
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    description?: string | null | undefined;
    location?: string | null | undefined;
    meetingLink?: string | null | undefined;
    meetingPlatform?: string | null | undefined;
    recurrencePattern?: string | null | undefined;
    calendarColor: string;
    externalEventID?: string | null | undefined;
    notes?: string | null | undefined;
    constructor(appointmentID: string, userID: string, title: string, appointmentType: 'general' | 'doctor' | 'business' | 'personal', startDateTime: string, endDateTime: string, allDayEvent: boolean, isVirtual: boolean, status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled', reminderMinutesBefore: number, isRecurring: boolean, externalSyncStatus: 'not_synced' | 'synced' | 'failed', isDeleted: boolean, createdAt: string, updatedAt: string, description?: string | null | undefined, location?: string | null | undefined, meetingLink?: string | null | undefined, meetingPlatform?: string | null | undefined, recurrencePattern?: string | null | undefined, calendarColor?: string, externalEventID?: string | null | undefined, notes?: string | null | undefined);
    /**
     * Factory method to create an Appointment from a DTO.
     */
    static fromDTO(dto: AppointmentDTO): Appointment;
    /**
     * Converts this Appointment to a DTO.
     */
    toDTO(): AppointmentDTO;
    /**
     * Updates the appointment. Only defined fields are updated.
     */
    update(updates: Partial<Omit<Appointment, 'appointmentID' | 'userID' | 'createdAt'>>): void;
    /**
     * Confirms the appointment.
     */
    confirm(): void;
    /**
     * Cancels the appointment.
     */
    cancel(): void;
    /**
     * Marks the appointment as completed.
     */
    complete(): void;
    /**
     * Reschedules the appointment.
     */
    reschedule(newStartDateTime: string, newEndDateTime: string): void;
    /**
     * Checks if the appointment is currently ongoing.
     */
    isOngoing(currentDate?: string): boolean;
    /**
     * Checks if the appointment is in the future.
     */
    isFuture(currentDate?: string): boolean;
    /**
     * Checks if the appointment is in the past.
     */
    isPast(currentDate?: string): boolean;
    /**
     * Validates the appointment times.
     */
    validate(): boolean;
}
//# sourceMappingURL=Appointment.d.ts.map