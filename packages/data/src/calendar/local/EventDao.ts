import { randomUUID } from 'node:crypto';
import { DatabaseClient } from '../../database/DatabaseClient';
import { CalendarEvent } from '@sphere/domain'; // Import from domain


export class EventDao {
  constructor(private readonly db: DatabaseClient) {}

  /**
   * Gets events from local storage for a date range.
   * Returns CalendarEvent instances (not plain objects).
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
    // Map each row to a CalendarEvent instance using the class constructor
    return rows.map((row) => this.mapRowToEvent(row));
  }

  /**
   * Gets a single event by ID.
   * Returns a CalendarEvent instance or null.
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
   * Returns a CalendarEvent instance.
   */
  upsertEvent(userID: string, event: CalendarEvent): CalendarEvent {
    const db = this.db.getDB();
    const now = new Date().toISOString();

    // Use event.id if it exists, otherwise generate a new UUID
    const id = event.id || randomUUID();

    // Ensure attendees is a JSON string if provided
    const attendeesJson = event.attendees ? JSON.stringify(event.attendees) : null;

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO calendar_events (
        id, user_id, source, external_id, title, description,
        start_datetime, end_datetime, all_day_event, location,
        meeting_link, color, organizer, attendees, status,
        recurrence_rule, is_recurring, created_at, updated_at, is_deleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);

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
      event.color || null, // color is string | undefined, null is acceptable in SQLite
      event.organizer || null,
      attendeesJson,
      event.status,
      event.recurrenceRule || null,
      event.isRecurring ? 1 : 0,
      event.createdAt || now,
      now
    );

    // Return a proper CalendarEvent instance with the updated timestamp
    return this.mapRowToEvent({
      id,
      source: event.source,
      external_id: event.externalID,
      title: event.title,
      description: event.description || null,
      start_datetime: event.startDateTime,
      end_datetime: event.endDateTime,
      all_day_event: event.allDayEvent ? 1 : 0,
      location: event.location || null,
      meeting_link: event.meetingLink || null,
      color: event.color || null,
      organizer: event.organizer || null,
      attendees: attendeesJson,
      status: event.status,
      recurrence_rule: event.recurrenceRule || null,
      is_recurring: event.isRecurring ? 1 : 0,
      created_at: event.createdAt || now,
      updated_at: now,
      is_deleted: 0,
    });
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
   * Maps a database row to a CalendarEvent instance.
   * This creates a proper domain object with all methods.
   * 
   * IMPORTANT: The CalendarEvent class constructor expects:
   * - color: string | undefined (not null)
   * - recurrenceRule: string | null | undefined
   */
  private mapRowToEvent(row: any): CalendarEvent {
    // Convert null to undefined for color field (to match domain type)
    const color = row.color === null ? undefined : row.color;
    
    // Parse attendees JSON if present
    let attendees: string[] = [];
    if (row.attendees) {
      try {
        attendees = JSON.parse(row.attendees);
      } catch {
        attendees = [];
      }
    }

    // Create a CalendarEvent instance using the class constructor
    // The CalendarEvent class from domain expects:
    // constructor(
    //   id, source, externalID, title, startDateTime, endDateTime,
    //   allDayEvent, status, isRecurring, createdAt, updatedAt,
    //   description?, location?, meetingLink?, color?,
    //   organizer?, attendees?, recurrenceRule?
    // )
    return new CalendarEvent(
      row.id,                          // id
      row.source,                      // source
      row.external_id,                 // externalID
      row.title,                       // title
      row.start_datetime,              // startDateTime
      row.end_datetime,                // endDateTime
      row.all_day_event === 1,         // allDayEvent
      row.status || 'confirmed',       // status
      row.is_recurring === 1,          // isRecurring
      row.created_at,                  // createdAt
      row.updated_at,                  // updatedAt
      row.description || null,         // description (optional)
      row.location || null,            // location (optional)
      row.meeting_link || null,        // meetingLink (optional)
      color,                           // color (string | undefined, not null)
      row.organizer || null,           // organizer (optional)
      attendees,                       // attendees (optional)
      row.recurrence_rule || null      // recurrenceRule (optional)
    );
  }
}