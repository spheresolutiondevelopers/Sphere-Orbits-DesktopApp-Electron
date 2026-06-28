import { Result } from '@sphere/shared';
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

export class BookAppointmentUseCase {
  constructor(private readonly appointmentRepo: IAppointmentRepository) {}

  async execute(input: BookAppointmentInput): Promise<Result<Appointment, Error>> {
    // Validate required fields
    if (!input.userID) {
      return Result.err(new Error('userID is required'));
    }
    if (!input.title || input.title.trim().length === 0) {
      return Result.err(new Error('Title is required'));
    }
    if (input.title.length > 255) {
      return Result.err(new Error('Title cannot exceed 255 characters'));
    }
    if (!input.startDateTime) {
      return Result.err(new Error('Start date/time is required'));
    }
    if (!input.endDateTime) {
      return Result.err(new Error('End date/time is required'));
    }

    // Validate that start is before end
    const start = new Date(input.startDateTime);
    const end = new Date(input.endDateTime);
    if (start >= end) {
      return Result.err(new Error('Start time must be before end time'));
    }

    // Check for conflicts
    const conflictResult = await this.appointmentRepo.checkConflicts(
      input.userID,
      input.startDateTime,
      input.endDateTime
    );

    if (conflictResult.isFailure()) {
      return conflictResult as any;
    }

    const conflicts = conflictResult.value;
    if (conflicts.length > 0) {
      return Result.err(
        new Error(`Appointment conflicts with ${conflicts.length} existing appointment(s)`)
      );
    }

    // Create the appointment entity
    const appointmentData = {
      userID: input.userID,
      title: input.title.trim(),
      appointmentType: input.appointmentType || 'general',
      startDateTime: input.startDateTime,
      endDateTime: input.endDateTime,
      allDayEvent: input.allDayEvent || false,
      description: input.description || null,
      location: input.location || null,
      isVirtual: input.isVirtual || false,
      meetingLink: input.meetingLink || null,
      meetingPlatform: input.meetingPlatform || null,
      status: 'scheduled' as const,
      reminderMinutesBefore: input.reminderMinutesBefore || 15,
      isRecurring: input.isRecurring || false,
      recurrencePattern: input.recurrencePattern || null,
      calendarColor: input.calendarColor || '#2196F3',
      notes: input.notes || null,
      externalSyncStatus: 'not_synced' as const,
      isDeleted: false,
    };

    // Use the repository to create the appointment (it will generate IDs and timestamps)
    return this.appointmentRepo.createAppointment(
      appointmentData as Omit<Appointment, 'appointmentID' | 'createdAt' | 'updatedAt'>
    );
  }
}