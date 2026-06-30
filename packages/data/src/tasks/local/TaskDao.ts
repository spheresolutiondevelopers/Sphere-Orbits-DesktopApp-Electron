import { randomUUID } from 'crypto';
import { DatabaseClient } from '../../database/DatabaseClient';
import { Task, TaskFilters, PaginationOptions, PaginatedResult } from '@sphere/domain';

export class TaskDao {
  constructor(private readonly db: DatabaseClient) {}

  /**
   * Gets tasks with filters and pagination.
   */
  getTasks(
    userID: string,
    filters?: TaskFilters,
    pagination?: PaginationOptions
  ): PaginatedResult<Task> {
    return this.db.transaction((db) => {
      let sql = `
        SELECT
          id, user_id, title, description, task_type, priority_level,
          status, completion_percentage, due_date, due_time, start_date,
          start_time, end_date, end_time, location_name, location_address,
          latitude, longitude, estimated_duration_minutes, actual_duration_minutes,
          time_spent_minutes, is_recurring, recurrence_rule, parent_task_id,
          external_id, external_source, external_sync_status, tags, notes,
          category_id, is_deleted, created_at, updated_at
        FROM tasks
        WHERE user_id = ? AND is_deleted = 0
      `;
      const params: any[] = [userID];
      const conditions: string[] = [];

      if (filters?.status) {
        conditions.push('status = ?');
        params.push(filters.status);
      }
      if (filters?.priority) {
        conditions.push('priority_level = ?');
        params.push(filters.priority);
      }
      if (filters?.taskType) {
        conditions.push('task_type = ?');
        params.push(filters.taskType);
      }
      if (filters?.categoryID) {
        conditions.push('category_id = ?');
        params.push(filters.categoryID);
      }
      if (filters?.dueDateFrom) {
        conditions.push('due_date >= ?');
        params.push(filters.dueDateFrom);
      }
      if (filters?.dueDateTo) {
        conditions.push('due_date <= ?');
        params.push(filters.dueDateTo);
      }
      if (filters?.search) {
        conditions.push('(title LIKE ? OR description LIKE ?)');
        params.push(`%${filters.search}%`, `%${filters.search}%`);
      }

      if (conditions.length > 0) {
        sql += ' AND ' + conditions.join(' AND ');
      }

      sql += ' ORDER BY due_date ASC, created_at DESC';

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

      const tasks = rows.map(this.mapRowToTask);
      return { items: tasks, total };
    });
  }

  /**
   * Gets a single task by ID.
   */
  getTaskById(taskID: string, userID: string): Task | null {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      SELECT
        id, user_id, title, description, task_type, priority_level,
        status, completion_percentage, due_date, due_time, start_date,
        start_time, end_date, end_time, location_name, location_address,
        latitude, longitude, estimated_duration_minutes, actual_duration_minutes,
        time_spent_minutes, is_recurring, recurrence_rule, parent_task_id,
        external_id, external_source, external_sync_status, tags, notes,
        category_id, is_deleted, created_at, updated_at
      FROM tasks
      WHERE id = ? AND user_id = ? AND is_deleted = 0
    `);
    const row = stmt.get(taskID, userID) as any;
    if (!row) return null;
    return this.mapRowToTask(row);
  }

  /**
   * Creates a new task.
   */
  createTask(
    task: Omit<Task, 'taskID' | 'createdAt' | 'updatedAt'>
  ): Task {
    const db = this.db.getDB();
    const id = randomUUID();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO tasks (
        id, user_id, title, description, task_type, priority_level,
        status, completion_percentage, due_date, due_time, start_date,
        start_time, end_date, end_time, location_name, location_address,
        latitude, longitude, estimated_duration_minutes, actual_duration_minutes,
        time_spent_minutes, is_recurring, recurrence_rule, parent_task_id,
        external_id, external_source, external_sync_status, tags, notes,
        category_id, is_deleted, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?
      )
    `);

    stmt.run(
      id,
      task.userID,
      task.title,
      task.description || null,
      task.taskType || 'general',
      task.priorityLevel || 'medium',
      task.status || 'pending',
      task.completionPercentage || 0,
      task.dueDate || null,
      task.dueTime || null,
      task.startDate || null,
      task.startTime || null,
      task.endDate || null,
      task.endTime || null,
      task.locationName || null,
      task.locationAddress || null,
      task.latitude || null,
      task.longitude || null,
      task.estimatedDurationMinutes || null,
      task.actualDurationMinutes || null,
      task.timeSpentMinutes || 0,
      task.isRecurring ? 1 : 0,
      task.recurrenceRule || null,
      task.parentTaskID || null,
      task.externalID || null,
      task.externalSource || null,
      task.externalSyncStatus || 'not_synced',
      task.tags || null,
      task.notes || null,
      task.categoryID || null,
      now,
      now
    );

    return { ...task, taskID: id, createdAt: now, updatedAt: now, isDeleted: false };
  }

  /**
   * Updates an existing task.
   */
  updateTask(taskID: string, updates: Partial<Task>): Task | null {
    const db = this.db.getDB();
    const now = new Date().toISOString();
    const fields: string[] = [];
    const params: any[] = [];

    const allowedFields = [
      'title', 'description', 'taskType', 'priorityLevel', 'status',
      'completionPercentage', 'dueDate', 'dueTime', 'startDate', 'startTime',
      'endDate', 'endTime', 'locationName', 'locationAddress', 'latitude',
      'longitude', 'estimatedDurationMinutes', 'actualDurationMinutes',
      'timeSpentMinutes', 'isRecurring', 'recurrenceRule', 'parentTaskID',
      'externalID', 'externalSource', 'externalSyncStatus', 'tags', 'notes',
      'categoryID',
    ];

    for (const key of allowedFields) {
      if (key in updates && updates[key as keyof Task] !== undefined) {
        const snakeKey = key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
        fields.push(`${snakeKey} = ?`);
        const value = updates[key as keyof Task];
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
    params.push(taskID);

    const stmt = db.prepare(`
      UPDATE tasks SET ${fields.join(', ')} WHERE id = ? AND is_deleted = 0
    `);
    const result = stmt.run(...params);
    if (result.changes === 0) {
      return null;
    }

    // Fetch the updated task
    return this.getTaskById(taskID, updates.userID || '');
  }

  /**
   * Soft-deletes a task.
   */
  softDelete(taskID: string, userID: string): void {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      UPDATE tasks SET is_deleted = 1, updated_at = ? WHERE id = ? AND user_id = ?
    `);
    stmt.run(new Date().toISOString(), taskID, userID);
  }

  /**
   * Hard-deletes a task.
   */
  hardDelete(taskID: string, userID: string): void {
    const db = this.db.getDB();
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?');
    stmt.run(taskID, userID);
  }

  /**
   * Gets tasks that need to be synced (external_sync_status != 'synced').
   */
  getTasksForSync(userID: string): Task[] {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      SELECT
        id, user_id, title, description, task_type, priority_level,
        status, completion_percentage, due_date, due_time, start_date,
        start_time, end_date, end_time, location_name, location_address,
        latitude, longitude, estimated_duration_minutes, actual_duration_minutes,
        time_spent_minutes, is_recurring, recurrence_rule, parent_task_id,
        external_id, external_source, external_sync_status, tags, notes,
        category_id, is_deleted, created_at, updated_at
      FROM tasks
      WHERE user_id = ? AND external_sync_status != 'synced' AND is_deleted = 0
    `);
    const rows = stmt.all(userID) as any[];
    return rows.map(this.mapRowToTask);
  }

  /**
   * Marks a task as synced.
   */
  markSynced(taskID: string): void {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      UPDATE tasks SET external_sync_status = 'synced', updated_at = ? WHERE id = ?
    `);
    stmt.run(new Date().toISOString(), taskID);
  }

  /**
   * Maps a database row to a Task object.
   */
  private mapRowToTask(row: any): Task {
    return {
      taskID: row.id,
      userID: row.user_id,
      title: row.title,
      description: row.description || null,
      taskType: row.task_type,
      priorityLevel: row.priority_level,
      status: row.status,
      completionPercentage: row.completion_percentage,
      dueDate: row.due_date || null,
      dueTime: row.due_time || null,
      startDate: row.start_date || null,
      startTime: row.start_time || null,
      endDate: row.end_date || null,
      endTime: row.end_time || null,
      locationName: row.location_name || null,
      locationAddress: row.location_address || null,
      latitude: row.latitude || null,
      longitude: row.longitude || null,
      estimatedDurationMinutes: row.estimated_duration_minutes || null,
      actualDurationMinutes: row.actual_duration_minutes || null,
      timeSpentMinutes: row.time_spent_minutes || 0,
      isRecurring: row.is_recurring === 1,
      recurrenceRule: row.recurrence_rule || null,
      parentTaskID: row.parent_task_id || null,
      externalID: row.external_id || null,
      externalSource: row.external_source || null,
      externalSyncStatus: row.external_sync_status,
      tags: row.tags || null,
      notes: row.notes || null,
      categoryID: row.category_id || null,
      isDeleted: row.is_deleted === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}