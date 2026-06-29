import { DatabaseClient } from '@sphere/data';

export interface SyncOperation {
  id: string;
  userID: string;
  entityType: string;
  entityID: string;
  operation: 'create' | 'update' | 'delete';
  payload: any;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  attempts: number;
  lastAttemptAt?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export class SyncQueueManager {
  private db: DatabaseClient;

  constructor() {
    // We'll get the database instance from the global state
    // This would be injected in a real implementation
    this.db = DatabaseClient.getInstance();
  }

  async addOperation(
    userID: string,
    entityType: string,
    entityID: string,
    operation: 'create' | 'update' | 'delete',
    payload: any
  ): Promise<void> {
    const db = this.db.getDB();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO sync_queue (
        id, user_id, entity_type, entity_id, operation, payload,
        status, attempts, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending', 0, ?, ?)
    `);

    stmt.run(
      id,
      userID,
      entityType,
      entityID,
      operation,
      JSON.stringify(payload),
      now,
      now
    );
  }

  async getPendingOperations(userID?: string): Promise<SyncOperation[]> {
    const db = this.db.getDB();
    let sql = `
      SELECT
        id, user_id, entity_type, entity_id, operation, payload,
        status, attempts, last_attempt_at, error, created_at, updated_at
      FROM sync_queue
      WHERE status IN ('pending', 'failed')
      ORDER BY created_at ASC
    `;
    const params: any[] = [];
    if (userID) {
      sql += ' AND user_id = ?';
      params.push(userID);
    }

    const stmt = db.prepare(sql);
    const rows = stmt.all(...params) as any[];
    return rows.map(this.mapRowToOperation);
  }

  async getPendingCount(userID?: string): Promise<number> {
    const db = this.db.getDB();
    let sql = 'SELECT COUNT(*) as count FROM sync_queue WHERE status IN ("pending", "failed")';
    const params: any[] = [];
    if (userID) {
      sql += ' AND user_id = ?';
      params.push(userID);
    }

    const stmt = db.prepare(sql);
    const row = stmt.get(...params) as { count: number };
    return row?.count || 0;
  }

  async markInProgress(id: string): Promise<void> {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      UPDATE sync_queue
      SET status = 'in_progress', last_attempt_at = ?, attempts = attempts + 1, updated_at = ?
      WHERE id = ?
    `);
    const now = new Date().toISOString();
    stmt.run(now, now, id);
  }

  async markComplete(id: string): Promise<void> {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      UPDATE sync_queue SET status = 'completed', updated_at = ? WHERE id = ?
    `);
    stmt.run(new Date().toISOString(), id);
  }

  async markFailed(id: string, error: string): Promise<void> {
    const db = this.db.getDB();
    const stmt = db.prepare(`
      UPDATE sync_queue
      SET status = 'failed', error = ?, updated_at = ?
      WHERE id = ?
    `);
    stmt.run(error, new Date().toISOString(), id);
  }

  async clearCompleted(userID?: string): Promise<void> {
    const db = this.db.getDB();
    let sql = 'DELETE FROM sync_queue WHERE status = "completed"';
    const params: any[] = [];
    if (userID) {
      sql += ' AND user_id = ?';
      params.push(userID);
    }
    const stmt = db.prepare(sql);
    stmt.run(...params);
  }

  private mapRowToOperation(row: any): SyncOperation {
    return {
      id: row.id,
      userID: row.user_id,
      entityType: row.entity_type,
      entityID: row.entity_id,
      operation: row.operation,
      payload: JSON.parse(row.payload),
      status: row.status,
      attempts: row.attempts,
      lastAttemptAt: row.last_attempt_at || undefined,
      error: row.error || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}