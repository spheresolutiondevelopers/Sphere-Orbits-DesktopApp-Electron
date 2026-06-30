import { ok, err, type Result, NoteSchema } from '@sphere/shared';
import { Note, INotesRepository, NoteFilters, PaginationOptions, PaginatedResult } from '@sphere/domain';
import { DatabaseClient } from '../database/DatabaseClient';
import { NoteDao } from './local/NoteDao';

export class NotesRepository implements INotesRepository {
  private noteDao: NoteDao;

  constructor(db: DatabaseClient) {
    this.noteDao = new NoteDao(db);
  }

  async getNotes(
    userID: string,
    filters?: NoteFilters,
    pagination?: PaginationOptions
  ): Promise<Result<PaginatedResult<Note>, Error>> {
    try {
      const result = this.noteDao.getNotes(userID, filters, pagination);
      return ok(result);
    } catch (error: any) {
      return err(error);
    }
  }

  async getNoteById(noteID: string, userID: string): Promise<Result<Note, Error>> {
    try {
      const note = this.noteDao.getNoteById(noteID, userID);
      if (!note) {
        return err(new Error('Note not found'));
      }
      return ok(note);
    } catch (error: any) {
      return err(error);
    }
  }

  async createNote(
    note: Omit<Note, 'noteID' | 'createdAt' | 'updatedAt'>
  ): Promise<Result<Note, Error>> {
    try {
      // Validate with Zod
      const validation = NoteSchema.omit({
        noteID: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
        userID: true,
      }).safeParse(note);
      if (!validation.success) {
        return err(new Error(validation.error.message));
      }

      // Ensure content is not empty
      if (!note.content || note.content.trim().length === 0) {
        return err(new Error('Note content cannot be empty'));
      }

      const created = this.noteDao.createNote(note);
      return ok(created);
    } catch (error: any) {
      return err(error);
    }
  }

  async updateNote(noteID: string, updates: Partial<Note>): Promise<Result<Note, Error>> {
    try {
      // Validate partial updates
      const validation = NoteSchema.partial().safeParse(updates);
      if (!validation.success) {
        return err(new Error(validation.error.message));
      }

      const updated = this.noteDao.updateNote(noteID, updates);
      if (!updated) {
        return err(new Error('Note not found'));
      }
      return ok(updated);
    } catch (error: any) {
      return err(error);
    }
  }

  async deleteNote(noteID: string, userID: string): Promise<Result<void, Error>> {
    try {
      this.noteDao.softDelete(noteID, userID);
      return ok(undefined);
    } catch (error: any) {
      return err(error);
    }
  }

  async permanentlyDeleteNote(noteID: string, userID: string): Promise<Result<void, Error>> {
    try {
      this.noteDao.hardDelete(noteID, userID);
      return ok(undefined);
    } catch (error: any) {
      return err(error);
    }
  }

  async getNotesForEntity(
    userID: string,
    entityType: 'task' | 'event' | 'appointment' | 'meeting',
    entityID: string
  ): Promise<Result<Note[], Error>> {
    try {
      const notes = this.noteDao.getNotesForEntity(userID, entityType, entityID);
      return ok(notes);
    } catch (error: any) {
      return err(error);
    }
  }

  async getNotesForSync(userID: string): Promise<Result<Note[], Error>> {
    try {
      const notes = this.noteDao.getNotesForSync(userID);
      return ok(notes);
    } catch (error: any) {
      return err(error);
    }
  }

  async markNoteSynced(noteID: string): Promise<Result<void, Error>> {
    try {
      this.noteDao.markSynced(noteID);
      return ok(undefined);
    } catch (error: any) {
      return err(error);
    }
  }
}