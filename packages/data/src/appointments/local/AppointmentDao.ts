import { randomUUID } from 'crypto';
import { DatabaseClient } from '../../database/DatabaseClient';
import { Appointment, AppointmentFilters, PaginationOptions, PaginatedResult } from '@sphere/domain';

export class AppointmentDao {
  constructor(private readonly db: DatabaseClient) {}

  /**
   * Gets appointments with filters and pagination.
   */
  getAppointments(
    userID: string,
    filters?: AppointmentFilters,
    pagination?: PaginationOptions
  ): PaginatedResult<Appointment> {
    return this.db.transaction((db) => {
      let sql = `
        SELECT
          id, user_id, title, description, appointment_type,
          start_datetime, end_datetime, all_day_event, location,
          is_virtual, meeting_link, meeting_platform, status,
          reminder_minutes_before, is_recurring, recurrence_pattern,
          calendar_color, external_event_id, external_sync_status, notes,
          is_deleted, created_at, updated_at
        FROM appointments
        WHERE user_id = ? AND is_deleted = 0
      `;
      const params: any[] = [userID];
      const conditions: string[] = [];

      if (filters?.status) {
        conditions.push('status = ?');
        params.push(filters.status);
      }
      if (filters?.appointmentType) {
        conditions.push('appointment_type = ?');
        params.push(filters.appointmentType);
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
        conditions.push('(title LIKE ? OR description LIKE ?)');
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
      const appointments = rows.map(this.mapRowToAppointment);
      return { items: appointments, total };
    });
  }

  /**
   * Gets a single appointment by ID.
   */
  getAppointmentById(appointmentID: string, userID: string): Appointment | null {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      SELECT
        id, user_id, title, description, appointment_type,
        start_datetime, end_datetime, all_day_event, location,
        is_virtual, meeting_link, meeting_platform, status,
        reminder_minutes_before, is_recurring, recurrence_pattern,
        calendar_color, external_event_id, external_sync_status, notes,
        is_deleted, created_at, updated_at
      FROM appointments
      WHERE id = ? AND user_id = ? AND is_deleted = 0
    `);
    const row = stmt.get(appointmentID, userID) as any;
    if (!row) return null;
    return this.mapRowToAppointment(row);
  }

  /**
   * Creates a new appointment.
   */
  createAppointment(
    appointment: Omit<Appointment, 'appointmentID' | 'createdAt' | 'updatedAt'>
  ): Appointment {
    const db = this.db.getDB();
    const id = randomUUID();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO appointments (
        id, user_id, title, description, appointment_type,
        start_datetime, end_datetime, all_day_event, location,
        is_virtual, meeting_link, meeting_platform, status,
        reminder_minutes_before, is_recurring, recurrence_pattern,
        calendar_color, external_event_id, external_sync_status, notes,
        is_deleted, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?
      )
    `);

    stmt.run(
      id,
      appointment.userID,
      appointment.title,
      appointment.description || null,
      appointment.appointmentType || 'general',
      appointment.startDateTime,
      appointment.endDateTime,
      appointment.allDayEvent ? 1 : 0,
      appointment.location || null,
      appointment.isVirtual ? 1 : 0,
      appointment.meetingLink || null,
      appointment.meetingPlatform || null,
      appointment.status || 'scheduled',
      appointment.reminderMinutesBefore || 15,
      appointment.isRecurring ? 1 : 0,
      appointment.recurrencePattern || null,
      appointment.calendarColor || '#2196F3',
      appointment.externalEventID || null,
      appointment.externalSyncStatus || 'not_synced',
      appointment.notes || null,
      now,
      now
    );

    return { ...appointment, appointmentID: id, createdAt: now, updatedAt: now, isDeleted: false };
  }

  /**
   * Updates an existing appointment.
   */
  updateAppointment(appointmentID: string, updates: Partial<Appointment>): Appointment | null {
    const db = this.db.getDB();
    const now = new Date().toISOString();
    const fields: string[] = [];
    const params: any[] = [];

    const allowedFields = [
      'title', 'description', 'appointmentType', 'startDateTime', 'endDateTime',
      'allDayEvent', 'location', 'isVirtual', 'meetingLink', 'meetingPlatform',
      'status', 'reminderMinutesBefore', 'isRecurring', 'recurrencePattern',
      'calendarColor', 'externalEventID', 'externalSyncStatus', 'notes',
    ];

    for (const key of allowedFields) {
      if (key in updates && updates[key as keyof Appointment] !== undefined) {
        const snakeKey = key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
        fields.push(`${snakeKey} = ?`);
        const value = updates[key as keyof Appointment];
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
    params.push(appointmentID);

    const stmt = db.prepare(`
      UPDATE appointments SET ${fields.join(', ')} WHERE id = ? AND is_deleted = 0
    `);
    const result = stmt.run(...params);
    if (result.changes === 0) {
      return null;
    }

    // Fetch the updated appointment
    const getStmt = db.prepare(`
      SELECT
        id, user_id, title, description, appointment_type,
        start_datetime, end_datetime, all_day_event, location,
        is_virtual, meeting_link, meeting_platform, status,
        reminder_minutes_before, is_recurring, recurrence_pattern,
        calendar_color, external_event_id, external_sync_status, notes,
        is_deleted, created_at, updated_at
      FROM appointments WHERE id = ?
    `);
    const row = getStmt.get(appointmentID) as any;
    if (!row) return null;
    return this.mapRowToAppointment(row);
  }

  /**
   * Soft-deletes an appointment.
   */
  softDelete(appointmentID: string, userID: string): void {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      UPDATE appointments SET is_deleted = 1, updated_at = ? WHERE id = ? AND user_id = ?
    `);
    stmt.run(new Date().toISOString(), appointmentID, userID);
  }

  /**
   * Gets conflicting appointments in a given time range.
   */
  getConflicts(
    userID: string,
    startDateTime: string,
    endDateTime: string,
    excludeAppointmentID?: string
  ): Appointment[] {
    const db = this.db.getDB();
    let sql = `
      SELECT
        id, user_id, title, description, appointment_type,
        start_datetime, end_datetime, all_day_event, location,
        is_virtual, meeting_link, meeting_platform, status,
        reminder_minutes_before, is_recurring, recurrence_pattern,
        calendar_color, external_event_id, external_sync_status, notes,
        is_deleted, created_at, updated_at
      FROM appointments
      WHERE user_id = ?
        AND is_deleted = 0
        AND status NOT IN ('cancelled', 'completed')
        AND (
          (start_datetime < ? AND end_datetime > ?) OR
          (start_datetime < ? AND end_datetime > ?) OR
          (start_datetime >= ? AND start_datetime < ?) OR
          (end_datetime > ? AND end_datetime <= ?)
        )
    `;
    const params: any[] = [
      userID,
      endDateTime, startDateTime, // overlapping interval
      endDateTime, startDateTime,
      startDateTime, endDateTime,
      startDateTime, endDateTime,
    ];

    if (excludeAppointmentID) {
      sql += ' AND id != ?';
      params.push(excludeAppointmentID);
    }

    const stmt = db.prepare(sql);
    const rows = stmt.all(...params) as any[];
    return rows.map(this.mapRowToAppointment);
  }

  /**
   * Gets appointments that need to be synced.
   */
  getAppointmentsForSync(userID: string): Appointment[] {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      SELECT
        id, user_id, title, description, appointment_type,
        start_datetime, end_datetime, all_day_event, location,
        is_virtual, meeting_link, meeting_platform, status,
        reminder_minutes_before, is_recurring, recurrence_pattern,
        calendar_color, external_event_id, external_sync_status, notes,
        is_deleted, created_at, updated_at
      FROM appointments
      WHERE user_id = ? AND external_sync_status != 'synced' AND is_deleted = 0
    `);
    const rows = stmt.all(userID) as any[];
    return rows.map(this.mapRowToAppointment);
  }

  /**
   * Marks an appointment as synced.
   */
  markSynced(appointmentID: string): void {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      UPDATE appointments SET external_sync_status = 'synced', updated_at = ? WHERE id = ?
    `);
    stmt.run(new Date().toISOString(), appointmentID);
  }

  /**
   * Maps a database row to an Appointment object.
   */
  private mapRowToAppointment(row: any): Appointment {
    return {
      appointmentID: row.id,
      userID: row.user_id,
      title: row.title,
      description: row.description || null,
      appointmentType: row.appointment_type,
      startDateTime: row.start_datetime,
      endDateTime: row.end_datetime,
      allDayEvent: row.all_day_event === 1,
      location: row.location || null,
      isVirtual: row.is_virtual === 1,
      meetingLink: row.meeting_link || null,
      meetingPlatform: row.meeting_platform || null,
      status: row.status,
      reminderMinutesBefore: row.reminder_minutes_before,
      isRecurring: row.is_recurring === 1,
      recurrencePattern: row.recurrence_pattern || null,
      calendarColor: row.calendar_color || '#2196F3',
      externalEventID: row.external_event_id || null,
      externalSyncStatus: row.external_sync_status || 'not_synced',
      notes: row.notes || null,
      isDeleted: row.is_deleted === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}