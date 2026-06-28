import { Result } from '@sphere/shared';
import { Meeting } from '../entities/Meeting';

export interface MeetingFilters {
  status?: 'scheduled' | 'live' | 'ended' | 'cancelled';
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

export interface IMeetingRepository {
  /**
   * Gets meetings for the current user with optional filters and pagination.
   */
  getMeetings(
    userID: string,
    filters?: MeetingFilters,
    pagination?: PaginationOptions
  ): Promise<Result<PaginatedResult<Meeting>, Error>>;

  /**
   * Gets a single meeting by ID.
   */
  getMeetingById(meetingID: string, userID: string): Promise<Result<Meeting, Error>>;

  /**
   * Creates a new meeting (linked to a task).
   */
  createMeeting(
    meeting: Omit<Meeting, 'meetingID' | 'createdAt' | 'updatedAt'>
  ): Promise<Result<Meeting, Error>>;

  /**
   * Updates an existing meeting.
   */
  updateMeeting(
    meetingID: string,
    updates: Partial<Meeting>
  ): Promise<Result<Meeting, Error>>;

  /**
   * Deletes a meeting (soft‑delete).
   */
  deleteMeeting(meetingID: string, userID: string): Promise<Result<void, Error>>;

  /**
   * Joins a meeting (updates status or adds participant).
   * This may involve calling an external API (e.g., Zoom) to generate a join link.
   */
  joinMeeting(
    meetingID: string,
    userID: string,
    participantEmail: string,
    participantName: string
  ): Promise<Result<{ meetingLink: string }, Error>>;

  /**
   * Gets all meetings that need to be synced.
   */
  getMeetingsForSync(userID: string): Promise<Result<Meeting[], Error>>;

  /**
   * Marks a meeting as synced.
   */
  markMeetingSynced(meetingID: string): Promise<Result<void, Error>>;
}