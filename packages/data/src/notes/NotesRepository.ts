import { Result, NoteSchema } from '@sphere/shared';
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
      const result = await this.noteDao.getNotes(userID, filters, pagination);
      return Result.ok(result);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async getNoteById(noteID: string, userID: string): Promise<Result<Note, Error>> {
    try {
      const note = await this.noteDao.getNoteById(noteID, userID);
      if (!note) {
        return Result.err(new Error('Note not found'));
      }
      return Result.ok(note);
    } catch (error: any) {
      return Result.err(error);
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
        return Result.err(new Error(validation.error.message));
      }

      // Ensure content is not empty
      if (!note.content || note.content.trim().length === 0) {
        return Result.err(new Error('Note content cannot be empty'));
      }

      const created = await this.noteDao.createNote(note);
      return Result.ok(created);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async updateNote(noteID: string, updates: Partial<Note>): Promise<Result<Note, Error>> {
    try {
      // Validate partial updates
      const validation = NoteSchema.partial().safeParse(updates);
      if (!validation.success) {
        return Result.err(new Error(validation.error.message));
      }

      const updated = await this.noteDao.updateNote(noteID, updates);
      if (!updated) {
        return Result.err(new Error('Note not found'));
      }
      return Result.ok(updated);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async deleteNote(noteID: string, userID: string): Promise<Result<void, Error>> {
    try {
      await this.noteDao.softDelete(noteID, userID);
      return Result.ok(undefined);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async permanentlyDeleteNote(noteID: string, userID: string): Promise<Result<void, Error>> {
    try {
      await this.noteDao.hardDelete(noteID, userID);
      return Result.ok(undefined);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async getNotesForEntity(
    userID: string,
    entityType: 'task' | 'event' | 'appointment' | 'meeting',
    entityID: string
  ): Promise<Result<Note[], Error>> {
    try {
      const notes = await this.noteDao.getNotesForEntity(userID, entityType, entityID);
      return Result.ok(notes);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async getNotesForSync(userID: string): Promise<Result<Note[], Error>> {
    try {
      const notes = await this.noteDao.getNotesForSync(userID);
      return Result.ok(notes);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async markNoteSynced(noteID: string): Promise<Result<void, Error>> {
    try {
      await this.noteDao.markSynced(noteID);
      return Result.ok(undefined);
    } catch (error: any) {
      return Result.err(error);
    }
  }
}