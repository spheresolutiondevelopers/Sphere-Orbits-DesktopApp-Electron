import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

export class DatabaseClient {
  private static instance: DatabaseClient;
  private db: Database.Database | null = null;
  private dbPath: string;

  private constructor(dbPath: string) {
    this.dbPath = dbPath;
  }

  static getInstance(dbPath?: string): DatabaseClient {
    if (!DatabaseClient.instance) {
      if (!dbPath) {
        throw new Error('Database path must be provided on first initialization');
      }
      DatabaseClient.instance = new DatabaseClient(dbPath);
    }
    return DatabaseClient.instance;
  }

  connect(): void {
    if (this.db) return;

    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(this.dbPath);
    this.db.pragma('foreign_keys = ON');
    this.db.pragma('journal_mode = WAL');

    this.runMigrations();
  }

  getDB(): Database.Database {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  disconnect(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  prepare(sql: string): Database.Statement {
    return this.getDB().prepare(sql);
  }

  exec(sql: string): void {
    this.getDB().exec(sql);
  }

  transaction<T>(fn: (db: Database.Database) => T): T {
    const db = this.getDB();
    return db.transaction(fn)(db);
  }

  private runMigrations(): void {
    this.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        applied_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    const applied = this.prepare('SELECT name FROM migrations').all() as { name: string }[];
    const appliedNames = new Set(applied.map((row) => row.name));

    // Get the correct path for migrations
    const candidates = [
      (process as any).resourcesPath ? path.join((process as any).resourcesPath, 'database', 'migrations') : '',
      path.join(process.cwd(), 'packages', 'main', 'src', 'database', 'migrations'),
      path.join(process.cwd(), 'packages', 'data', 'src', 'database', 'migrations'),
      path.join(__dirname, 'migrations'),
      path.join(__dirname, '..', '..', '..', 'main', 'src', 'database', 'migrations'),
    ].filter(Boolean);

    const migrationsDir = candidates.find((dir) => {
      try {
        return fs.existsSync(dir);
      } catch {
        return false;
      }
    });

    if (!migrationsDir) {
      console.warn('Migrations directory not found, skipping migrations.');
      return;
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter((f: string) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      if (!appliedNames.has(file)) {
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        this.exec(sql);
        this.prepare('INSERT INTO migrations (name) VALUES (?)').run(file);
        console.log(`Applied migration: ${file}`);
      }
    }
  }
}