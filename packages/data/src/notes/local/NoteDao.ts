import { randomUUID } from 'node:crypto';
import { DatabaseClient } from '../../database/DatabaseClient';
import { Note, NoteFilters, PaginationOptions, PaginatedResult } from '@sphere/domain';

export class NoteDao {
  constructor(private readonly db: DatabaseClient) {}

  getNotes(
    userID: string,
    filters?: NoteFilters,
    pagination?: PaginationOptions
  ): PaginatedResult<Note> {
    return this.db.transaction((db) => {
      let sql = `
        SELECT
          id, user_id, title, content, task_id, event_id,
          appointment_id, meeting_id, is_deleted, created_at, updated_at
        FROM notes
        WHERE user_id = ? AND is_deleted = 0
      `;
      const params: any[] = [userID];
      const conditions: string[] = [];

      if (filters?.entityType) {
        const colMap: Record<string, string> = {
          task: 'task_id',
          event: 'event_id',
          appointment: 'appointment_id',
          meeting: 'meeting_id',
        };
        const col = colMap[filters.entityType];
        if (col) {
          conditions.push(`${col} IS NOT NULL`);
          if (filters.entityID) {
            conditions.push(`${col} = ?`);
            params.push(filters.entityID);
          }
        }
      } else if (filters?.entityID) {
        conditions.push(`
          (task_id = ? OR event_id = ? OR appointment_id = ? OR meeting_id = ?)
        `);
        const id = filters.entityID;
        params.push(id, id, id, id);
      }

      if (filters?.search) {
        conditions.push('(title LIKE ? OR content LIKE ?)');
        params.push(`%${filters.search}%`, `%${filters.search}%`);
      }

      if (filters?.isDeleted !== undefined) {
        conditions.push(`is_deleted = ?`);
        params.push(filters.isDeleted ? 1 : 0);
      }

      if (conditions.length > 0) {
        sql += ' AND ' + conditions.join(' AND ');
      }

      sql += ' ORDER BY created_at DESC';

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
      const notes = rows.map((row) => this.mapRowToNote(row));
      return { items: notes, total };
    });
  }

  getNoteById(noteID: string, userID: string): Note | null {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      SELECT
        id, user_id, title, content, task_id, event_id,
        appointment_id, meeting_id, is_deleted, created_at, updated_at
      FROM notes
      WHERE id = ? AND user_id = ? AND is_deleted = 0
    `);
    const row = stmt.get(noteID, userID) as any;
    if (!row) return null;
    return this.mapRowToNote(row);
  }

  createNote(
    note: Omit<Note, 'noteID' | 'createdAt' | 'updatedAt'>
  ): Note {
    const db = this.db.getDB();
    const id = randomUUID();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO notes (
        id, user_id, title, content, task_id, event_id,
        appointment_id, meeting_id, is_deleted, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `);

    stmt.run(
      id,
      note.userID,
      note.title || null,
      note.content,
      note.taskID || null,
      note.eventID || null,
      note.appointmentID || null,
      note.meetingID || null,
      now,
      now
    );

    return this.mapRowToNote({
      id,
      user_id: note.userID,
      title: note.title || null,
      content: note.content,
      task_id: note.taskID || null,
      event_id: note.eventID || null,
      appointment_id: note.appointmentID || null,
      meeting_id: note.meetingID || null,
      is_deleted: 0,
      created_at: now,
      updated_at: now,
    });
  }

  updateNote(noteID: string, updates: Partial<Note>): Note | null {
    const db = this.db.getDB();
    const now = new Date().toISOString();
    const fields: string[] = [];
    const params: any[] = [];

    const allowedFields = [
      'title', 'content', 'taskID', 'eventID', 'appointmentID', 'meetingID',
    ];

    for (const key of allowedFields) {
      if (key in updates && updates[key as keyof Note] !== undefined) {
        const snakeKey = key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
        fields.push(`${snakeKey} = ?`);
        const value = updates[key as keyof Note];
        if (value === null || value === undefined) {
          params.push(null);
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
    params.push(noteID);

    const stmt = db.prepare(`
      UPDATE notes SET ${fields.join(', ')} WHERE id = ? AND is_deleted = 0
    `);
    const result = stmt.run(...params);
    if (result.changes === 0) {
      return null;
    }

    const getStmt = db.prepare(`
      SELECT
        id, user_id, title, content, task_id, event_id,
        appointment_id, meeting_id, is_deleted, created_at, updated_at
      FROM notes WHERE id = ?
    `);
    const row = getStmt.get(noteID) as any;
    if (!row) return null;
    return this.mapRowToNote(row);
  }

  softDelete(noteID: string, userID: string): void {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      UPDATE notes SET is_deleted = 1, updated_at = ? WHERE id = ? AND user_id = ?
    `);
    stmt.run(new Date().toISOString(), noteID, userID);
  }

  hardDelete(noteID: string, userID: string): void {
    const db = this.db.getDB();
    const stmt = db.prepare('DELETE FROM notes WHERE id = ? AND user_id = ?');
    stmt.run(noteID, userID);
  }

  getNotesForEntity(
    userID: string,
    entityType: 'task' | 'event' | 'appointment' | 'meeting',
    entityID: string
  ): Note[] {
    const db = this.db.getDB();
    const colMap: Record<string, string> = {
      task: 'task_id',
      event: 'event_id',
      appointment: 'appointment_id',
      meeting: 'meeting_id',
    };
    const col = colMap[entityType];
    if (!col) {
      throw new Error(`Invalid entityType: ${entityType}`);
    }

    const stmt = db.prepare(`
      SELECT
        id, user_id, title, content, task_id, event_id,
        appointment_id, meeting_id, is_deleted, created_at, updated_at
      FROM notes
      WHERE user_id = ? AND ${col} = ? AND is_deleted = 0
      ORDER BY created_at DESC
    `);
    const rows = stmt.all(userID, entityID) as any[];
    return rows.map((row) => this.mapRowToNote(row));
  }

  getNotesForSync(userID: string): Note[] {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      SELECT
        id, user_id, title, content, task_id, event_id,
        appointment_id, meeting_id, is_deleted, created_at, updated_at
      FROM notes
      WHERE user_id = ? AND is_deleted = 0 AND external_sync_status != 'synced'
    `);
    const rows = stmt.all(userID) as any[];
    return rows.map((row) => this.mapRowToNote(row));
  }

  markSynced(noteID: string): void {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      UPDATE notes SET external_sync_status = 'synced', updated_at = ? WHERE id = ?
    `);
    stmt.run(new Date().toISOString(), noteID);
  }

  /**
   * Maps a database row to a Note instance.
   * This creates a proper domain object with all methods.
   */
  private mapRowToNote(row: any): Note {
    // Note constructor expects:
    // constructor(
    //   noteID, userID, content, isDeleted, createdAt, updatedAt,
    //   title?, taskID?, eventID?, appointmentID?, meetingID?
    // )
    return new Note(
      row.id,                              // noteID
      row.user_id,                         // userID
      row.content,                         // content
      row.is_deleted === 1,                // isDeleted
      row.created_at,                      // createdAt
      row.updated_at,                      // updatedAt
      row.title || null,                   // title (optional)
      row.task_id || null,                 // taskID (optional)
      row.event_id || null,                // eventID (optional)
      row.appointment_id || null,          // appointmentID (optional)
      row.meeting_id || null               // meetingID (optional)
    );
  }
}