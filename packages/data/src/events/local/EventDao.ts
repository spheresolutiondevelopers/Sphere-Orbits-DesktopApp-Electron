import { randomUUID } from 'crypto';
import { DatabaseClient } from '../../database/DatabaseClient';
import { Event, EventFilters, PaginationOptions, PaginatedResult } from '@sphere/domain';

export class EventDao {
  constructor(private readonly db: DatabaseClient) {}

  /**
   * Gets events with filters and pagination.
   */
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
      const events = rows.map(this.mapRowToEvent);
      return { items: events, total };
    });
  }

  /**
   * Gets a single event by ID.
   */
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

  /**
   * Creates a new event.
   */
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

    return { ...event, eventID: id, createdAt: now, updatedAt: now, isDeleted: false };
  }

  /**
   * Updates an existing event.
   */
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

    // Fetch the updated event
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

  /**
   * Soft-deletes an event.
   */
  softDelete(eventID: string, userID: string): void {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      UPDATE events SET is_deleted = 1, updated_at = ? WHERE id = ? AND user_id = ?
    `);
    stmt.run(new Date().toISOString(), eventID, userID);
  }

  /**
   * Gets events that need to be synced.
   */
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
    return rows.map(this.mapRowToEvent);
  }

  /**
   * Marks an event as synced.
   */
  markSynced(eventID: string): void {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      UPDATE events SET external_sync_status = 'synced', updated_at = ? WHERE id = ?
    `);
    stmt.run(new Date().toISOString(), eventID);
  }

  /**
   * Maps a database row to an Event object.
   */
  private mapRowToEvent(row: any): Event {
    return {
      eventID: row.id,
      userID: row.user_id,
      categoryID: row.category_id || null,
      taskID: row.task_id || null,
      name: row.name,
      format: row.format || null,
      planningNotes: row.planning_notes || null,
      startDateTime: row.start_datetime || null,
      endDateTime: row.end_datetime || null,
      status: row.status,
      isRecurring: row.is_recurring === 1,
      recurrencePattern: row.recurrence_pattern || null,
      isDeleted: row.is_deleted === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}