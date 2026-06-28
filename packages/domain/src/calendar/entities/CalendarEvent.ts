import { CalendarEvent as CalendarEventDTO } from '@sphere/shared';

export class CalendarEvent {
  constructor(
    public readonly id: string,
    public source: 'google' | 'outlook' | 'apple',
    public externalID: string,
    public title: string,
    public startDateTime: string,
    public endDateTime: string,
    public allDayEvent: boolean,
    public status: 'confirmed' | 'tentative' | 'cancelled',
    public isRecurring: boolean,
    public createdAt: string,
    public updatedAt: string,
    public description?: string | null,
    public location?: string | null,
    public meetingLink?: string | null,
    public color?: string,
    public organizer?: string,
    public attendees?: string[],
    public recurrenceRule?: string | null
  ) {}

  /**
   * Factory method to create a CalendarEvent from a DTO.
   */
  static fromDTO(dto: CalendarEventDTO): CalendarEvent {
    return new CalendarEvent(
      dto.id,
      dto.source,
      dto.externalID,
      dto.title,
      dto.startDateTime,
      dto.endDateTime,
      dto.allDayEvent,
      dto.status,
      dto.isRecurring,
      dto.createdAt,
      dto.updatedAt,
      dto.description,
      dto.location,
      dto.meetingLink,
      dto.color,
      dto.organizer,
      dto.attendees,
      dto.recurrenceRule
    );
  }

  /**
   * Converts this CalendarEvent to a DTO.
   */
  toDTO(): CalendarEventDTO {
    return {
      id: this.id,
      source: this.source,
      externalID: this.externalID,
      title: this.title,
      description: this.description,
      startDateTime: this.startDateTime,
      endDateTime: this.endDateTime,
      allDayEvent: this.allDayEvent,
      location: this.location,
      meetingLink: this.meetingLink,
      color: this.color,
      organizer: this.organizer,
      attendees: this.attendees,
      status: this.status,
      recurrenceRule: this.recurrenceRule,
      isRecurring: this.isRecurring,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Updates the event. Only defined fields are updated.
   */
  update(updates: Partial<Omit<CalendarEvent, 'id' | 'source' | 'externalID' | 'createdAt'>>): void {
    Object.assign(this, updates);
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Checks if the event is currently ongoing.
   */
  isOngoing(currentDate: string = new Date().toISOString()): boolean {
    const now = new Date(currentDate);
    const start = new Date(this.startDateTime);
    const end = new Date(this.endDateTime);
    return now >= start && now <= end;
  }

  /**
   * Checks if the event is in the future.
   */
  isFuture(currentDate: string = new Date().toISOString()): boolean {
    return new Date(this.startDateTime) > new Date(currentDate);
  }

  /**
   * Checks if the event is in the past.
   */
  isPast(currentDate: string = new Date().toISOString()): boolean {
    return new Date(this.endDateTime) < new Date(currentDate);
  }
}