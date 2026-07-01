import { type Result } from '@sphere/shared';
import { INotesRepository } from '../repositories/INotesRepository';
import { Note } from '../entities/Note';
export interface SaveNoteInput {
    userID: string;
    content: string;
    title?: string | null;
    taskID?: string | null;
    eventID?: string | null;
    appointmentID?: string | null;
    meetingID?: string | null;
    noteID?: string;
}
export declare class SaveNoteUseCase {
    private readonly notesRepo;
    constructor(notesRepo: INotesRepository);
    execute(input: SaveNoteInput): Promise<Result<Note, Error>>;
}
//# sourceMappingURL=SaveNoteUseCase.d.ts.map