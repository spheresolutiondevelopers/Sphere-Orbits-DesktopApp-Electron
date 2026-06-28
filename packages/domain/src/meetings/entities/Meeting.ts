import { Meeting as MeetingDTO } from '@sphere/shared';

export class Meeting {
  constructor(
    public readonly meetingID: string,
    public taskID: string,
    public organizerUserID: string,
    public title: string,
    public startDateTime: string,
    public endDateTime: string,
    public status: 'scheduled' | 'live' | 'ended' | 'cancelled',
    public isRecurring: boolean,
    public isDeleted: boolean,
    public createdAt: string,
    public updatedAt: string,
    public description?: string | null,
    public meetingLink?: string | null,
    public meetingPlatform?: string | null,
    public recurrencePattern?: string | null
  ) {}

  /**
   * Factory method to create a Meeting from a DTO.
   */
  static fromDTO(dto: MeetingDTO): Meeting {
    return new Meeting(
      dto.meetingID,
      dto.taskID,
      dto.organizerUserID,
      dto.title,
      dto.startDateTime,
      dto.endDateTime,
      dto.status,
      dto.isRecurring,
      dto.isDeleted,
      dto.createdAt,
      dto.updatedAt,
      dto.description,
      dto.meetingLink,
      dto.meetingPlatform,
      dto.recurrencePattern
    );
  }

  /**
   * Converts this Meeting to a DTO.
   */
  toDTO(): MeetingDTO {
    return {
      meetingID: this.meetingID,
      taskID: this.taskID,
      organizerUserID: this.organizerUserID,
      title: this.title,
      description: this.description,
      startDateTime: this.startDateTime,
      endDateTime: this.endDateTime,
      meetingLink: this.meetingLink,
      meetingPlatform: this.meetingPlatform,
      isRecurring: this.isRecurring,
      recurrencePattern: this.recurrencePattern,
      status: this.status,
      isDeleted: this.isDeleted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Updates the meeting. Only defined fields are updated.
   */
  update(updates: Partial<Omit<Meeting, 'meetingID' | 'organizerUserID' | 'createdAt'>>): void {
    Object.assign(this, updates);
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Marks the meeting as live.
   */
  start(): void {
    if (this.status === 'scheduled') {
      this.status = 'live';
      this.updatedAt = new Date().toISOString();
    } else {
      throw new Error(`Cannot start meeting with status: ${this.status}`);
    }
  }

  /**
   * Marks the meeting as ended.
   */
  end(): void {
    if (this.status === 'live') {
      this.status = 'ended';
      this.updatedAt = new Date().toISOString();
    } else {
      throw new Error(`Cannot end meeting with status: ${this.status}`);
    }
  }

  /**
   * Cancels the meeting.
   */
  cancel(): void {
    if (this.status !== 'cancelled') {
      this.status = 'cancelled';
      this.updatedAt = new Date().toISOString();
    }
  }

  /**
   * Checks if the meeting is currently live.
   */
  isLive(currentDate: string = new Date().toISOString()): boolean {
    if (this.status !== 'scheduled' && this.status !== 'live') {
      return false;
    }
    const now = new Date(currentDate);
    const start = new Date(this.startDateTime);
    const end = new Date(this.endDateTime);
    return now >= start && now <= end;
  }

  /**
   * Checks if the meeting is in the future.
   */
  isFuture(currentDate: string = new Date().toISOString()): boolean {
    return new Date(this.startDateTime) > new Date(currentDate);
  }

  /**
   * Checks if the meeting is in the past.
   */
  isPast(currentDate: string = new Date().toISOString()): boolean {
    return new Date(this.endDateTime) < new Date(currentDate);
  }
}