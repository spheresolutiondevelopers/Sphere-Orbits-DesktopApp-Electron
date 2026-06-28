import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export class DatabaseClient {
  private static instance: DatabaseClient;
  private db: Database.Database | null = null;
  private dbPath: string;

  private constructor(dbPath: string) {
    this.dbPath = dbPath;
  }

  /**
   * Gets the singleton instance of the database client.
   * @param dbPath - Path to the SQLite database file (must be provided on first call)
   */
  static getInstance(dbPath?: string): DatabaseClient {
    if (!DatabaseClient.instance) {
      if (!dbPath) {
        throw new Error('Database path must be provided on first initialization');
      }
      DatabaseClient.instance = new DatabaseClient(dbPath);
    }
    return DatabaseClient.instance;
  }

  /**
   * Opens the database connection and runs migrations.
   */
  connect(): void {
    if (this.db) {
      return;
    }

    // Ensure the directory exists
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(this.dbPath, { verbose: console.log });
    this.db.pragma('foreign_keys = ON');
    this.db.pragma('journal_mode = WAL');

    this.runMigrations();
  }

  /**
   * Returns the database instance.
   */
  getDB(): Database.Database {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  /**
   * Closes the database connection.
   */
  disconnect(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  /**
   * Prepares a SQL statement.
   */
  prepare(sql: string): Database.Statement {
    return this.getDB().prepare(sql);
  }

  /**
   * Executes a SQL statement (for DDL).
   */
  exec(sql: string): void {
    this.getDB().exec(sql);
  }

  /**
   * Runs a transaction.
   */
  transaction<T>(fn: (db: Database.Database) => T): T {
    const db = this.getDB();
    return db.transaction(fn)(db);
  }

  /**
   * Runs all migration files in order.
   */
  private runMigrations(): void {
    // Create migrations table if it doesn't exist
    this.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        applied_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    // Get list of already applied migrations
    const applied = this.prepare('SELECT name FROM migrations').all() as { name: string }[];
    const appliedNames = new Set(applied.map((row) => row.name));

    // Get migration files from the migrations directory
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort(); // Ensure order

    // Apply each migration if not already applied
    for (const file of files) {
      if (!appliedNames.has(file)) {
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        this.exec(sql);
        // Record the migration
        this.prepare('INSERT INTO migrations (name) VALUES (?)').run(file);
        console.log(`Applied migration: ${file}`);
      }
    }
  }
}