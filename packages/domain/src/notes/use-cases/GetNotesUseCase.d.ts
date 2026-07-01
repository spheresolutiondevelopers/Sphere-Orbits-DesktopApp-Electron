import { type Result } from '@sphere/shared';
import { INotesRepository, NoteFilters, PaginationOptions, PaginatedResult } from '../repositories/INotesRepository';
import { Note } from '../entities/Note';
export declare class GetNotesUseCase {
    private readonly notesRepo;
    constructor(notesRepo: INotesRepository);
    execute(userID: string, filters?: NoteFilters, pagination?: PaginationOptions): Promise<Result<PaginatedResult<Note>, Error>>;
}
//# sourceMappingURL=GetNotesUseCase.d.ts.map