import { Note as NoteDTO } from '@sphere/shared';
export declare class Note {
    readonly noteID: string;
    userID: string;
    content: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    title?: string | null | undefined;
    taskID?: string | null | undefined;
    eventID?: string | null | undefined;
    appointmentID?: string | null | undefined;
    meetingID?: string | null | undefined;
    constructor(noteID: string, userID: string, content: string, isDeleted: boolean, createdAt: string, updatedAt: string, title?: string | null | undefined, taskID?: string | null | undefined, eventID?: string | null | undefined, appointmentID?: string | null | undefined, meetingID?: string | null | undefined);
    /**
     * Factory method to create a Note from a DTO.
     */
    static fromDTO(dto: NoteDTO): Note;
    /**
     * Converts this Note to a DTO.
     */
    toDTO(): NoteDTO;
    /**
     * Updates the note. Only defined fields are updated.
     */
    update(updates: Partial<Omit<Note, 'noteID' | 'userID' | 'createdAt'>>): void;
    /**
     * Soft‑deletes the note.
     */
    delete(): void;
    /**
     * Restores a soft‑deleted note.
     */
    restore(): void;
    /**
     * Returns a plain‑text preview of the note (truncated).
     */
    getPreview(maxLength?: number): string;
}
//# sourceMappingURL=Note.d.ts.map