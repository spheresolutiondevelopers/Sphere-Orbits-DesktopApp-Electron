import { Result } from '@sphere/shared';
import { INotesRepository, NoteFilters, PaginationOptions, PaginatedResult } from '../repositories/INotesRepository';
import { Note } from '../entities/Note';

export class GetNotesUseCase {
  constructor(private readonly notesRepo: INotesRepository) {}

  async execute(
    userID: string,
    filters?: NoteFilters,
    pagination?: PaginationOptions
  ): Promise<Result<PaginatedResult<Note>, Error>> {
    if (!userID) {
      return Result.err(new Error('userID is required'));
    }
    return this.notesRepo.getNotes(userID, filters, pagination);
  }
}