import { Event as EventDTO } from '@sphere/shared';

export class Event {
  constructor(
    public readonly eventID: string,
    public userID: string,
    public name: string,
    public status: 'planned' | 'ongoing' | 'completed' | 'cancelled',
    public isRecurring: boolean,
    public isDeleted: boolean,
    public createdAt: string,
    public updatedAt: string,
    public categoryID?: string | null,
    public taskID?: string | null,
    public format?: string | null,
    public planningNotes?: string | null,
    public startDateTime?: string | null,
    public endDateTime?: string | null,
    public recurrencePattern?: string | null
  ) {}

  /**
   * Factory method to create an Event from a DTO.
   */
  static fromDTO(dto: EventDTO): Event {
    return new Event(
      dto.eventID,
      dto.userID,
      dto.name,
      dto.status,
      dto.isRecurring,
      dto.isDeleted,
      dto.createdAt,
      dto.updatedAt,
      dto.categoryID,
      dto.taskID,
      dto.format,
      dto.planningNotes,
      dto.startDateTime,
      dto.endDateTime,
      dto.recurrencePattern
    );
  }

  /**
   * Converts this Event to a DTO.
   */
  toDTO(): EventDTO {
    return {
      eventID: this.eventID,
      userID: this.userID,
      categoryID: this.categoryID,
      taskID: this.taskID,
      name: this.name,
      format: this.format,
      planningNotes: this.planningNotes,
      startDateTime: this.startDateTime,
      endDateTime: this.endDateTime,
      status: this.status,
      isRecurring: this.isRecurring,
      recurrencePattern: this.recurrencePattern,
      isDeleted: this.isDeleted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Updates the event. Only defined fields are updated.
   */
  update(updates: Partial<Omit<Event, 'eventID' | 'userID' | 'createdAt'>>): void {
    Object.assign(this, updates);
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Marks the event as ongoing.
   */
  start(): void {
    if (this.status === 'planned') {
      this.status = 'ongoing';
      this.updatedAt = new Date().toISOString();
    }
  }

  /**
   * Marks the event as completed.
   */
  complete(): void {
    if (this.status !== 'cancelled') {
      this.status = 'completed';
      this.updatedAt = new Date().toISOString();
    }
  }

  /**
   * Cancels the event.
   */
  cancel(): void {
    if (this.status !== 'completed') {
      this.status = 'cancelled';
      this.updatedAt = new Date().toISOString();
    }
  }

  /**
   * Checks if the event is currently ongoing.
   */
  isOngoing(currentDate: string = new Date().toISOString()): boolean {
    if (this.status !== 'ongoing' && this.status !== 'planned') {
      return false;
    }
    if (!this.startDateTime || !this.endDateTime) {
      return this.status === 'ongoing';
    }
    const now = new Date(currentDate);
    const start = new Date(this.startDateTime);
    const end = new Date(this.endDateTime);
    return now >= start && now <= end;
  }

  /**
   * Checks if the event is in the future.
   */
  isFuture(currentDate: string = new Date().toISOString()): boolean {
    if (this.status === 'completed' || this.status === 'cancelled') {
      return false;
    }
    if (!this.startDateTime) {
      return false;
    }
    return new Date(this.startDateTime) > new Date(currentDate);
  }

  /**
   * Checks if the event is in the past.
   */
  isPast(currentDate: string = new Date().toISOString()): boolean {
    if (this.status === 'completed' || this.status === 'cancelled') {
      return true;
    }
    if (!this.endDateTime) {
      return false;
    }
    return new Date(this.endDateTime) < new Date(currentDate);
  }
}