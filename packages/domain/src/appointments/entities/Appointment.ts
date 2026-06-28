import { Appointment as AppointmentDTO } from '@sphere/shared';

export class Appointment {
  constructor(
    public readonly appointmentID: string,
    public userID: string,
    public title: string,
    public appointmentType: 'general' | 'doctor' | 'business' | 'personal',
    public startDateTime: string,
    public endDateTime: string,
    public allDayEvent: boolean,
    public isVirtual: boolean,
    public status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled',
    public reminderMinutesBefore: number,
    public isRecurring: boolean,
    public externalSyncStatus: 'not_synced' | 'synced' | 'failed',
    public isDeleted: boolean,
    public createdAt: string,
    public updatedAt: string,
    public description?: string | null,
    public location?: string | null,
    public meetingLink?: string | null,
    public meetingPlatform?: string | null,
    public recurrencePattern?: string | null,
    public calendarColor: string = '#2196F3',
    public externalEventID?: string | null,
    public notes?: string | null
  ) {}

  /**
   * Factory method to create an Appointment from a DTO.
   */
  static fromDTO(dto: AppointmentDTO): Appointment {
    return new Appointment(
      dto.appointmentID,
      dto.userID,
      dto.title,
      dto.appointmentType,
      dto.startDateTime,
      dto.endDateTime,
      dto.allDayEvent,
      dto.isVirtual,
      dto.status,
      dto.reminderMinutesBefore,
      dto.isRecurring,
      dto.externalSyncStatus,
      dto.isDeleted,
      dto.createdAt,
      dto.updatedAt,
      dto.description,
      dto.location,
      dto.meetingLink,
      dto.meetingPlatform,
      dto.recurrencePattern,
      dto.calendarColor,
      dto.externalEventID,
      dto.notes
    );
  }

  /**
   * Converts this Appointment to a DTO.
   */
  toDTO(): AppointmentDTO {
    return {
      appointmentID: this.appointmentID,
      userID: this.userID,
      title: this.title,
      description: this.description,
      appointmentType: this.appointmentType,
      startDateTime: this.startDateTime,
      endDateTime: this.endDateTime,
      allDayEvent: this.allDayEvent,
      location: this.location,
      isVirtual: this.isVirtual,
      meetingLink: this.meetingLink,
      meetingPlatform: this.meetingPlatform,
      status: this.status,
      reminderMinutesBefore: this.reminderMinutesBefore,
      isRecurring: this.isRecurring,
      recurrencePattern: this.recurrencePattern,
      calendarColor: this.calendarColor,
      externalEventID: this.externalEventID,
      externalSyncStatus: this.externalSyncStatus,
      notes: this.notes,
      isDeleted: this.isDeleted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Updates the appointment. Only defined fields are updated.
   */
  update(updates: Partial<Omit<Appointment, 'appointmentID' | 'userID' | 'createdAt'>>): void {
    Object.assign(this, updates);
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Confirms the appointment.
   */
  confirm(): void {
    if (this.status === 'scheduled' || this.status === 'rescheduled') {
      this.status = 'confirmed';
      this.updatedAt = new Date().toISOString();
    }
  }

  /**
   * Cancels the appointment.
   */
  cancel(): void {
    if (this.status !== 'completed' && this.status !== 'cancelled') {
      this.status = 'cancelled';
      this.updatedAt = new Date().toISOString();
    }
  }

  /**
   * Marks the appointment as completed.
   */
  complete(): void {
    if (this.status === 'confirmed' || this.status === 'scheduled') {
      this.status = 'completed';
      this.updatedAt = new Date().toISOString();
    }
  }

  /**
   * Reschedules the appointment.
   */
  reschedule(newStartDateTime: string, newEndDateTime: string): void {
    if (this.status === 'completed' || this.status === 'cancelled') {
      throw new Error(`Cannot reschedule a ${this.status} appointment`);
    }
    this.startDateTime = newStartDateTime;
    this.endDateTime = newEndDateTime;
    this.status = 'rescheduled';
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Checks if the appointment is currently ongoing.
   */
  isOngoing(currentDate: string = new Date().toISOString()): boolean {
    const now = new Date(currentDate);
    const start = new Date(this.startDateTime);
    const end = new Date(this.endDateTime);
    return now >= start && now <= end && this.status !== 'cancelled' && this.status !== 'completed';
  }

  /**
   * Checks if the appointment is in the future.
   */
  isFuture(currentDate: string = new Date().toISOString()): boolean {
    return new Date(this.startDateTime) > new Date(currentDate) && this.status !== 'cancelled';
  }

  /**
   * Checks if the appointment is in the past.
   */
  isPast(currentDate: string = new Date().toISOString()): boolean {
    return new Date(this.endDateTime) < new Date(currentDate) || this.status === 'completed';
  }

  /**
   * Validates the appointment times.
   */
  validate(): boolean {
    if (this.allDayEvent) {
      // For all-day events, start and end must be on the same day or end is start + 1 day
      const start = new Date(this.startDateTime);
      const end = new Date(this.endDateTime);
      const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= 1 && diffDays >= 0;
    }
    return new Date(this.startDateTime) < new Date(this.endDateTime);
  }
}