import { Result } from '@sphere/shared';
import { Note } from '../entities/Note';

export interface NoteFilters {
  entityType?: 'task' | 'event' | 'appointment' | 'meeting';
  entityID?: string;
  search?: string;
  isDeleted?: boolean;
}

export interface PaginationOptions {
  limit: number;
  offset: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export interface INotesRepository {
  /**
   * Gets notes for the current user with optional filters and pagination.
   */
  getNotes(
    userID: string,
    filters?: NoteFilters,
    pagination?: PaginationOptions
  ): Promise<Result<PaginatedResult<Note>, Error>>;

  /**
   * Gets a single note by ID.
   */
  getNoteById(noteID: string, userID: string): Promise<Result<Note, Error>>;

  /**
   * Creates a new note.
   */
  createNote(
    note: Omit<Note, 'noteID' | 'createdAt' | 'updatedAt'>
  ): Promise<Result<Note, Error>>;

  /**
   * Updates an existing note.
   */
  updateNote(
    noteID: string,
    updates: Partial<Note>
  ): Promise<Result<Note, Error>>;

  /**
   * Deletes a note (soft‑delete).
   */
  deleteNote(noteID: string, userID: string): Promise<Result<void, Error>>;

  /**
   * Permanently removes a note.
   */
  permanentlyDeleteNote(noteID: string, userID: string): Promise<Result<void, Error>>;

  /**
   * Gets notes linked to a specific entity.
   */
  getNotesForEntity(
    userID: string,
    entityType: 'task' | 'event' | 'appointment' | 'meeting',
    entityID: string
  ): Promise<Result<Note[], Error>>;

  /**
   * Gets all notes that need to be synced.
   */
  getNotesForSync(userID: string): Promise<Result<Note[], Error>>;

  /**
   * Marks a note as synced.
   */
  markNoteSynced(noteID: string): Promise<Result<void, Error>>;
}