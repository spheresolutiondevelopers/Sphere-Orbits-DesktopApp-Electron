import { randomUUID } from 'node:crypto';
import { DatabaseClient } from '../../database/DatabaseClient';
import { Task, TaskFilters, PaginationOptions, PaginatedResult } from '@sphere/domain';

export class TaskDao {
  constructor(private readonly db: DatabaseClient) {}

  /**
   * Gets tasks with filters and pagination.
   * Returns PaginatedResult<Task> with proper Task instances.
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

      // Map each row to a Task instance using the domain class
      const tasks = rows.map((row) => this.mapRowToTask(row));
      return { items: tasks, total };
    });
  }

  /**
   * Gets a single task by ID.
   * Returns a Task instance or null.
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
   * Returns a Task instance.
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

    // Return the created task as a proper Task instance
    return this.mapRowToTask({
      id,
      user_id: task.userID,
      title: task.title,
      description: task.description || null,
      task_type: task.taskType || 'general',
      priority_level: task.priorityLevel || 'medium',
      status: task.status || 'pending',
      completion_percentage: task.completionPercentage || 0,
      due_date: task.dueDate || null,
      due_time: task.dueTime || null,
      start_date: task.startDate || null,
      start_time: task.startTime || null,
      end_date: task.endDate || null,
      end_time: task.endTime || null,
      location_name: task.locationName || null,
      location_address: task.locationAddress || null,
      latitude: task.latitude || null,
      longitude: task.longitude || null,
      estimated_duration_minutes: task.estimatedDurationMinutes || null,
      actual_duration_minutes: task.actualDurationMinutes || null,
      time_spent_minutes: task.timeSpentMinutes || 0,
      is_recurring: task.isRecurring ? 1 : 0,
      recurrence_rule: task.recurrenceRule || null,
      parent_task_id: task.parentTaskID || null,
      external_id: task.externalID || null,
      external_source: task.externalSource || null,
      external_sync_status: task.externalSyncStatus || 'not_synced',
      tags: task.tags || null,
      notes: task.notes || null,
      category_id: task.categoryID || null,
      is_deleted: 0,
      created_at: now,
      updated_at: now,
    });
  }

  /**
   * Updates an existing task.
   * Returns the updated Task instance or null.
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
        // Convert camelCase to snake_case for SQL
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
    // We need userID to fetch, but we don't have it; we'll fetch without userID filter
    const getStmt = db.prepare(`
      SELECT
        id, user_id, title, description, task_type, priority_level,
        status, completion_percentage, due_date, due_time, start_date,
        start_time, end_date, end_time, location_name, location_address,
        latitude, longitude, estimated_duration_minutes, actual_duration_minutes,
        time_spent_minutes, is_recurring, recurrence_rule, parent_task_id,
        external_id, external_source, external_sync_status, tags, notes,
        category_id, is_deleted, created_at, updated_at
      FROM tasks WHERE id = ?
    `);
    const row = getStmt.get(taskID) as any;
    if (!row) return null;
    return this.mapRowToTask(row);
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
    return rows.map((row) => this.mapRowToTask(row));
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
   * Maps a database row to a Task instance.
   * This creates a proper domain object with all methods.
   * 
   * The Task class constructor expects parameters in this order:
   * constructor(
   *   taskID, userID, title, taskType, priorityLevel, status,
   *   completionPercentage, isRecurring, externalSyncStatus,
   *   isDeleted, createdAt, updatedAt,
   *   description?, dueDate?, dueTime?, startDate?, startTime?,
   *   endDate?, endTime?, locationName?, locationAddress?,
   *   latitude?, longitude?, estimatedDurationMinutes?,
   *   actualDurationMinutes?, timeSpentMinutes?, recurrenceRule?,
   *   parentTaskID?, externalID?, externalSource?, tags?, notes?, categoryID?
   * )
   */
  private mapRowToTask(row: any): Task {
    return new Task(
      row.id,                                   // taskID
      row.user_id,                              // userID
      row.title,                                // title
      row.task_type || 'general',               // taskType
      row.priority_level || 'medium',           // priorityLevel
      row.status || 'pending',                  // status
      row.completion_percentage || 0,           // completionPercentage
      row.is_recurring === 1,                   // isRecurring
      row.external_sync_status || 'not_synced', // externalSyncStatus
      row.is_deleted === 1,                     // isDeleted
      row.created_at,                           // createdAt
      row.updated_at,                           // updatedAt
      row.description || null,                  // description (optional)
      row.due_date || null,                     // dueDate (optional)
      row.due_time || null,                     // dueTime (optional)
      row.start_date || null,                   // startDate (optional)
      row.start_time || null,                   // startTime (optional)
      row.end_date || null,                     // endDate (optional)
      row.end_time || null,                     // endTime (optional)
      row.location_name || null,                // locationName (optional)
      row.location_address || null,             // locationAddress (optional)
      row.latitude || null,                     // latitude (optional)
      row.longitude || null,                    // longitude (optional)
      row.estimated_duration_minutes || null,   // estimatedDurationMinutes (optional)
      row.actual_duration_minutes || null,      // actualDurationMinutes (optional)
      row.time_spent_minutes || 0,              // timeSpentMinutes (optional)
      row.recurrence_rule || null,              // recurrenceRule (optional)
      row.parent_task_id || null,               // parentTaskID (optional)
      row.external_id || null,                  // externalID (optional)
      row.external_source || null,              // externalSource (optional)
      row.tags || null,                         // tags (optional)
      row.notes || null,                        // notes (optional)
      row.category_id || null                   // categoryID (optional)
    );
  }
}