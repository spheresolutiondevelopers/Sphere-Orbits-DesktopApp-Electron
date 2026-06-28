import { DatabaseClient } from '../../database/DatabaseClient';
import { CalendarEvent } from '@sphere/domain';

export class EventDao {
  constructor(private readonly db: DatabaseClient) {}

  /**
   * Gets events from local storage for a date range.
   */
  getEvents(userID: string, startDate: string, endDate: string): CalendarEvent[] {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      SELECT
        id, source, external_id, title, description,
        start_datetime, end_datetime, all_day_event, location,
        meeting_link, color, organizer, attendees, status,
        recurrence_rule, is_recurring, created_at, updated_at
      FROM calendar_events
      WHERE user_id = ?
        AND start_datetime >= ?
        AND end_datetime <= ?
        AND is_deleted = 0
      ORDER BY start_datetime ASC
    `);
    const rows = stmt.all(userID, startDate, endDate) as any[];
    return rows.map(this.mapRowToEvent);
  }

  /**
   * Gets a single event by ID.
   */
  getEventById(eventID: string, userID: string): CalendarEvent | null {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      SELECT
        id, source, external_id, title, description,
        start_datetime, end_datetime, all_day_event, location,
        meeting_link, color, organizer, attendees, status,
        recurrence_rule, is_recurring, created_at, updated_at
      FROM calendar_events
      WHERE id = ? AND user_id = ? AND is_deleted = 0
    `);
    const row = stmt.get(eventID, userID) as any;
    if (!row) return null;
    return this.mapRowToEvent(row);
  }

  /**
   * Upserts an event (insert or replace).
   */
  upsertEvent(userID: string, event: CalendarEvent): CalendarEvent {
    const db = this.db.getDB();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO calendar_events (
        id, user_id, source, external_id, title, description,
        start_datetime, end_datetime, all_day_event, location,
        meeting_link, color, organizer, attendees, status,
        recurrence_rule, is_recurring, created_at, updated_at, is_deleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);

    const id = event.id || crypto.randomUUID();

    stmt.run(
      id,
      userID,
      event.source,
      event.externalID,
      event.title,
      event.description || null,
      event.startDateTime,
      event.endDateTime,
      event.allDayEvent ? 1 : 0,
      event.location || null,
      event.meetingLink || null,
      event.color || null,
      event.organizer || null,
      event.attendees ? JSON.stringify(event.attendees) : null,
      event.status,
      event.recurrenceRule || null,
      event.isRecurring ? 1 : 0,
      event.createdAt || now,
      now
    );

    return { ...event, id, updatedAt: now };
  }

  /**
   * Soft-deletes an event.
   */
  softDeleteEvent(eventID: string, userID: string): void {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      UPDATE calendar_events SET is_deleted = 1, updated_at = ? WHERE id = ? AND user_id = ?
    `);
    stmt.run(new Date().toISOString(), eventID, userID);
  }

  /**
   * Hard-deletes an event.
   */
  hardDeleteEvent(eventID: string, userID: string): void {
    const db = this.db.getDB();
    const stmt = db.prepare('DELETE FROM calendar_events WHERE id = ? AND user_id = ?');
    stmt.run(eventID, userID);
  }

  /**
   * Maps a database row to a CalendarEvent object.
   */
  private mapRowToEvent(row: any): CalendarEvent {
    return {
      id: row.id,
      source: row.source,
      externalID: row.external_id,
      title: row.title,
      description: row.description || null,
      startDateTime: row.start_datetime,
      endDateTime: row.end_datetime,
      allDayEvent: row.all_day_event === 1,
      location: row.location || null,
      meetingLink: row.meeting_link || null,
      color: row.color || null,
      organizer: row.organizer || null,
      attendees: row.attendees ? JSON.parse(row.attendees) : [],
      status: row.status,
      recurrenceRule: row.recurrence_rule || null,
      isRecurring: row.is_recurring === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}