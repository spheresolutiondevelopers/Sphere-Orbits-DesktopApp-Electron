import { randomUUID } from 'node:crypto';
import { DatabaseClient } from '../../database/DatabaseClient';
import { Event, EventFilters, PaginationOptions, PaginatedResult } from '@sphere/domain';

export class EventDao {
  constructor(private readonly db: DatabaseClient) {}

  getEvents(
    userID: string,
    filters?: EventFilters,
    pagination?: PaginationOptions
  ): PaginatedResult<Event> {
    return this.db.transaction((db) => {
      let sql = `
        SELECT
          id, user_id, category_id, task_id, name, format,
          planning_notes, start_datetime, end_datetime, status,
          is_recurring, recurrence_pattern, is_deleted, created_at, updated_at
        FROM events
        WHERE user_id = ? AND is_deleted = 0
      `;
      const params: any[] = [userID];
      const conditions: string[] = [];

      if (filters?.status) {
        conditions.push('status = ?');
        params.push(filters.status);
      }
      if (filters?.categoryID) {
        conditions.push('category_id = ?');
        params.push(filters.categoryID);
      }
      if (filters?.startDateFrom) {
        conditions.push('start_datetime >= ?');
        params.push(filters.startDateFrom);
      }
      if (filters?.startDateTo) {
        conditions.push('start_datetime <= ?');
        params.push(filters.startDateTo);
      }
      if (filters?.search) {
        conditions.push('(name LIKE ? OR planning_notes LIKE ?)');
        params.push(`%${filters.search}%`, `%${filters.search}%`);
      }

      if (conditions.length > 0) {
        sql += ' AND ' + conditions.join(' AND ');
      }

      sql += ' ORDER BY start_datetime ASC, created_at DESC';

      const countSql = sql.replace(
        /SELECT[\s\S]*?FROM/,
        'SELECT COUNT(*) as total FROM'
      );
      const countStmt = db.prepare(countSql);
      const totalRow = countStmt.get(...params) as { total: number };
      const total = totalRow?.total || 0;

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
      const events = rows.map((row) => this.mapRowToEvent(row));
      return { items: events, total };
    });
  }

  getEventById(eventID: string, userID: string): Event | null {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      SELECT
        id, user_id, category_id, task_id, name, format,
        planning_notes, start_datetime, end_datetime, status,
        is_recurring, recurrence_pattern, is_deleted, created_at, updated_at
      FROM events
      WHERE id = ? AND user_id = ? AND is_deleted = 0
    `);
    const row = stmt.get(eventID, userID) as any;
    if (!row) return null;
    return this.mapRowToEvent(row);
  }

  createEvent(
    event: Omit<Event, 'eventID' | 'createdAt' | 'updatedAt'>
  ): Event {
    const db = this.db.getDB();
    const id = randomUUID();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO events (
        id, user_id, category_id, task_id, name, format,
        planning_notes, start_datetime, end_datetime, status,
        is_recurring, recurrence_pattern, is_deleted, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `);

    stmt.run(
      id,
      event.userID,
      event.categoryID || null,
      event.taskID || null,
      event.name,
      event.format || null,
      event.planningNotes || null,
      event.startDateTime || null,
      event.endDateTime || null,
      event.status || 'planned',
      event.isRecurring ? 1 : 0,
      event.recurrencePattern || null,
      now,
      now
    );

    return this.mapRowToEvent({
      id,
      user_id: event.userID,
      category_id: event.categoryID || null,
      task_id: event.taskID || null,
      name: event.name,
      format: event.format || null,
      planning_notes: event.planningNotes || null,
      start_datetime: event.startDateTime || null,
      end_datetime: event.endDateTime || null,
      status: event.status || 'planned',
      is_recurring: event.isRecurring ? 1 : 0,
      recurrence_pattern: event.recurrencePattern || null,
      is_deleted: 0,
      created_at: now,
      updated_at: now,
    });
  }

  updateEvent(eventID: string, updates: Partial<Event>): Event | null {
    const db = this.db.getDB();
    const now = new Date().toISOString();
    const fields: string[] = [];
    const params: any[] = [];

    const allowedFields = [
      'categoryID', 'taskID', 'name', 'format', 'planningNotes',
      'startDateTime', 'endDateTime', 'status', 'isRecurring', 'recurrencePattern',
    ];

    for (const key of allowedFields) {
      if (key in updates && updates[key as keyof Event] !== undefined) {
        const snakeKey = key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
        fields.push(`${snakeKey} = ?`);
        const value = updates[key as keyof Event];
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
      return null;
    }

    fields.push('updated_at = ?');
    params.push(now);
    params.push(eventID);

    const stmt = db.prepare(`
      UPDATE events SET ${fields.join(', ')} WHERE id = ? AND is_deleted = 0
    `);
    const result = stmt.run(...params);
    if (result.changes === 0) {
      return null;
    }

    const getStmt = db.prepare(`
      SELECT
        id, user_id, category_id, task_id, name, format,
        planning_notes, start_datetime, end_datetime, status,
        is_recurring, recurrence_pattern, is_deleted, created_at, updated_at
      FROM events WHERE id = ?
    `);
    const row = getStmt.get(eventID) as any;
    if (!row) return null;
    return this.mapRowToEvent(row);
  }

  softDelete(eventID: string, userID: string): void {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      UPDATE events SET is_deleted = 1, updated_at = ? WHERE id = ? AND user_id = ?
    `);
    stmt.run(new Date().toISOString(), eventID, userID);
  }

  getEventsForSync(userID: string): Event[] {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      SELECT
        id, user_id, category_id, task_id, name, format,
        planning_notes, start_datetime, end_datetime, status,
        is_recurring, recurrence_pattern, is_deleted, created_at, updated_at
      FROM events
      WHERE user_id = ? AND is_deleted = 0 AND external_sync_status != 'synced'
    `);
    const rows = stmt.all(userID) as any[];
    return rows.map((row) => this.mapRowToEvent(row));
  }

  markSynced(eventID: string): void {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      UPDATE events SET external_sync_status = 'synced', updated_at = ? WHERE id = ?
    `);
    stmt.run(new Date().toISOString(), eventID);
  }

  /**
   * Maps a database row to an Event instance.
   * This creates a proper domain object with all methods.
   */
  private mapRowToEvent(row: any): Event {
    // Event constructor expects:
    // constructor(
    //   eventID, userID, name, status, isRecurring, isDeleted,
    //   createdAt, updatedAt, categoryID?, taskID?, format?,
    //   planningNotes?, startDateTime?, endDateTime?, recurrencePattern?
    // )
    return new Event(
      row.id,                              // eventID
      row.user_id,                         // userID
      row.name,                            // name
      row.status || 'planned',             // status
      row.is_recurring === 1,              // isRecurring
      row.is_deleted === 1,                // isDeleted
      row.created_at,                      // createdAt
      row.updated_at,                      // updatedAt
      row.category_id || null,             // categoryID (optional)
      row.task_id || null,                 // taskID (optional)
      row.format || null,                  // format (optional)
      row.planning_notes || null,          // planningNotes (optional)
      row.start_datetime || null,          // startDateTime (optional)
      row.end_datetime || null,            // endDateTime (optional)
      row.recurrence_pattern || null       // recurrencePattern (optional)
    );
  }
}