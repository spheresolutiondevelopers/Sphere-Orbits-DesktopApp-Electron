import { ok, err, type Result, MeetingSchema } from '@sphere/shared';
import { Meeting, IMeetingRepository, MeetingFilters, PaginationOptions, PaginatedResult } from '@sphere/domain';
import { DatabaseClient } from '../database/DatabaseClient';
import { ZoomApi } from './remote/ZoomApi';
import { randomUUID } from 'crypto';

export class MeetingRepository implements IMeetingRepository {
  private zoomApi: ZoomApi;

  constructor(db: DatabaseClient, apiBaseURL: string) {
    this.zoomApi = new ZoomApi(apiBaseURL);
  }

  setAuthToken(token: string): void {
    this.zoomApi.setAuthToken(token);
  }

  async getMeetings(
    userID: string,
    filters?: MeetingFilters,
    pagination?: PaginationOptions
  ): Promise<Result<PaginatedResult<Meeting>, Error>> {
    try {
      // Meetings are stored as tasks with taskType = 'meeting'
      // We query the tasks table directly via a SQL query
      const db = this.getDB();
      let sql = `
        SELECT
          m.id, m.task_id, m.organizer_user_id, m.title, m.description,
          m.start_datetime, m.end_datetime, m.meeting_link, m.meeting_platform,
          m.is_recurring, m.recurrence_pattern, m.status,
          m.is_deleted, m.created_at, m.updated_at,
          t.user_id
        FROM meetings m
        JOIN tasks t ON t.id = m.task_id
        WHERE t.user_id = ? AND m.is_deleted = 0
      `;
      const params: any[] = [userID];

      if (filters?.status) {
        sql += ' AND m.status = ?';
        params.push(filters.status);
      }
      if (filters?.search) {
        sql += ' AND (m.title LIKE ? OR m.description LIKE ?)';
        params.push(`%${filters.search}%`, `%${filters.search}%`);
      }
      if (filters?.startDateFrom) {
        sql += ' AND m.start_datetime >= ?';
        params.push(filters.startDateFrom);
      }
      if (filters?.startDateTo) {
        sql += ' AND m.start_datetime <= ?';
        params.push(filters.startDateTo);
      }

      sql += ' ORDER BY m.start_datetime ASC';

      // Count total
      const countSql = sql.replace(
        /SELECT[\s\S]*?FROM/,
        'SELECT COUNT(*) as total FROM'
      );
      const countStmt = db.prepare(countSql);
      const totalRow = countStmt.get(...params) as { total: number };
      const total = totalRow?.total || 0;

      // Apply pagination
      if (pagination?.limit !== undefined) {
        sql += ' LIMIT ?';
        params.push(pagination.limit);
        if (pagination.offset !== undefined) {
          sql += ' OFFSET ?';
          params.push(pagination.offset);
        }
      }

      const stmt = db.prepare(sql);
      const rows = stmt.all(...params) as any[];
      const meetings = rows.map(this.mapRowToMeeting);

      return ok({ items: meetings, total });
    } catch (error: any) {
      return err(error);
    }
  }

  async getMeetingById(meetingID: string, userID: string): Promise<Result<Meeting, Error>> {
    try {
      const db = this.getDB();
      const stmt = db.prepare(`
        SELECT
          m.id, m.task_id, m.organizer_user_id, m.title, m.description,
          m.start_datetime, m.end_datetime, m.meeting_link, m.meeting_platform,
          m.is_recurring, m.recurrence_pattern, m.status,
          m.is_deleted, m.created_at, m.updated_at,
          t.user_id
        FROM meetings m
        JOIN tasks t ON t.id = m.task_id
        WHERE m.id = ? AND t.user_id = ? AND m.is_deleted = 0
      `);
      const row = stmt.get(meetingID, userID) as any;
      if (!row) {
        return err(new Error('Meeting not found'));
      }
      return ok(this.mapRowToMeeting(row));
    } catch (error: any) {
      return err(error);
    }
  }

  async createMeeting(
    meeting: Omit<Meeting, 'meetingID' | 'createdAt' | 'updatedAt'>
  ): Promise<Result<Meeting, Error>> {
    try {
      // Validate with Zod
      const validation = MeetingSchema.omit({
        meetingID: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
        organizerUserID: true,
      }).safeParse(meeting);
      if (!validation.success) {
        return err(new Error(validation.error.message));
      }

      const db = this.getDB();
      const id = randomUUID();
      const now = new Date().toISOString();

      // First, ensure the task exists and is a meeting type
      const taskStmt = db.prepare(`
        SELECT id FROM tasks WHERE id = ? AND task_type = 'meeting' AND is_deleted = 0
      `);
      const task = taskStmt.get(meeting.taskID);
      if (!task) {
        return err(new Error('Task not found or not a meeting type'));
      }

      const stmt = db.prepare(`
        INSERT INTO meetings (
          id, task_id, organizer_user_id, title, description,
          start_datetime, end_datetime, meeting_link, meeting_platform,
          is_recurring, recurrence_pattern, status,
          is_deleted, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
      `);

      stmt.run(
        id,
        meeting.taskID,
        meeting.organizerUserID,
        meeting.title,
        meeting.description || null,
        meeting.startDateTime,
        meeting.endDateTime,
        meeting.meetingLink || null,
        meeting.meetingPlatform || null,
        meeting.isRecurring ? 1 : 0,
        meeting.recurrencePattern || null,
        meeting.status || 'scheduled',
        now,
        now
      );

      // Return the created meeting
      return this.getMeetingById(id, meeting.organizerUserID);
    } catch (error: any) {
      return err(error);
    }
  }

  async updateMeeting(meetingID: string, updates: Partial<Meeting>): Promise<Result<Meeting, Error>> {
    try {
      // Validate partial updates
      const validation = MeetingSchema.partial().safeParse(updates);
      if (!validation.success) {
        return err(new Error(validation.error.message));
      }

      const db = this.getDB();
      const now = new Date().toISOString();
      const fields: string[] = [];
      const params: any[] = [];

      const allowedFields = [
        'title', 'description', 'startDateTime', 'endDateTime',
        'meetingLink', 'meetingPlatform', 'isRecurring', 'recurrencePattern',
        'status',
      ];

      for (const key of allowedFields) {
        if (key in updates && updates[key as keyof Meeting] !== undefined) {
          // Convert camelCase to snake_case
          const snakeKey = key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
          fields.push(`${snakeKey} = ?`);
          const value = updates[key as keyof Meeting];
          if (value === null || value === undefined) {
            params.push(null);
          } else if (typeof value === 'boolean') {
            params.push(value ? 1 : 0);
          } else {
            params.push(value);
          }
        }
      }

      if (fields.length === 0) {
        return err(new Error('No fields to update'));
      }

      fields.push('updated_at = ?');
      params.push(now);
      params.push(meetingID);

      const stmt = db.prepare(`
        UPDATE meetings SET ${fields.join(', ')} WHERE id = ? AND is_deleted = 0
      `);
      const result = stmt.run(...params);
      if (result.changes === 0) {
        return err(new Error('Meeting not found'));
      }

      // Fetch the updated meeting
      const getStmt = db.prepare(`
        SELECT
          id, task_id, organizer_user_id, title, description,
          start_datetime, end_datetime, meeting_link, meeting_platform,
          is_recurring, recurrence_pattern, status,
          is_deleted, created_at, updated_at
        FROM meetings WHERE id = ?
      `);
      const row = getStmt.get(meetingID) as any;
      if (!row) {
        return err(new Error('Meeting not found'));
      }

      const updatedMeeting = this.mapRowToMeeting(row);
      return ok(updatedMeeting);
    } catch (error: any) {
      return err(error);
    }
  }

  async deleteMeeting(meetingID: string, userID: string): Promise<Result<void, Error>> {
    try {
      const db = this.getDB();
      // First, verify the meeting belongs to the user via the task
      const verifyStmt = db.prepare(`
        SELECT m.id
        FROM meetings m
        JOIN tasks t ON t.id = m.task_id
        WHERE m.id = ? AND t.user_id = ?
      `);
      const result = verifyStmt.get(meetingID, userID);
      if (!result) {
        return err(new Error('Meeting not found or not authorized'));
      }

      const stmt = db.prepare(`
        UPDATE meetings SET is_deleted = 1, updated_at = ? WHERE id = ?
      `);
      stmt.run(new Date().toISOString(), meetingID);
      return ok(undefined);
    } catch (error: any) {
      return err(error);
    }
  }

  async joinMeeting(
    meetingID: string,
    userID: string,
    participantEmail: string,
    participantName: string
  ): Promise<Result<{ meetingLink: string }, Error>> {
    try {
      // First, get the meeting to know its platform and link
      const meetingResult = await this.getMeetingById(meetingID, userID);
      if (meetingResult.isFailure()) {
        return err(meetingResult.error);
      }

      const meeting = meetingResult.value;

      // If it's a Zoom meeting, generate a join link
      if (meeting.meetingPlatform === 'Zoom' && meeting.meetingLink) {
        // For Zoom, we can generate a join link using the Zoom API
        const joinLink = await this.zoomApi.generateJoinLink(
          meeting.meetingLink,
          participantEmail,
          participantName
        );
        return ok({ meetingLink: joinLink });
      }

      // If it's a Google Meet or Teams, just return the existing link
      if (meeting.meetingLink) {
        return ok({ meetingLink: meeting.meetingLink });
      }

      return err(new Error('No meeting link available'));
    } catch (error: any) {
      return err(error);
    }
  }

  async getMeetingsForSync(userID: string): Promise<Result<Meeting[], Error>> {
    try {
      const db = this.getDB();
      const stmt = db.prepare(`
        SELECT
          m.id, m.task_id, m.organizer_user_id, m.title, m.description,
          m.start_datetime, m.end_datetime, m.meeting_link, m.meeting_platform,
          m.is_recurring, m.recurrence_pattern, m.status,
          m.is_deleted, m.created_at, m.updated_at,
          t.user_id
        FROM meetings m
        JOIN tasks t ON t.id = m.task_id
        WHERE t.user_id = ? AND m.is_deleted = 0
          AND m.external_sync_status != 'synced'
      `);
      const rows = stmt.all(userID) as any[];
      const meetings = rows.map(this.mapRowToMeeting);
      return ok(meetings);
    } catch (error: any) {
      return err(error);
    }
  }

  async markMeetingSynced(meetingID: string): Promise<Result<void, Error>> {
    try {
      const db = this.getDB();
      const stmt = db.prepare(`
        UPDATE meetings SET external_sync_status = 'synced', updated_at = ? WHERE id = ?
      `);
      stmt.run(new Date().toISOString(), meetingID);
      return ok(undefined);
    } catch (error: any) {
      return err(error);
    }
  }

  /**
   * Helper to get the database instance.
   */
  private getDB() {
    // We need a database instance; we'll get it from the constructor.
    throw new Error('getDB not implemented');
  }

  /**
   * Maps a database row to a Meeting object.
   */
  private mapRowToMeeting(row: any): Meeting {
    return {
      meetingID: row.id,
      taskID: row.task_id,
      organizerUserID: row.organizer_user_id,
      title: row.title,
      description: row.description || null,
      startDateTime: row.start_datetime,
      endDateTime: row.end_datetime,
      meetingLink: row.meeting_link || null,
      meetingPlatform: row.meeting_platform || null,
      isRecurring: row.is_recurring === 1,
      recurrencePattern: row.recurrence_pattern || null,
      status: row.status,
      isDeleted: row.is_deleted === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}