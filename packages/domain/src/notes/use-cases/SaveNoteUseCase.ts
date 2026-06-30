import { err, type Result } from '@sphere/shared';
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
  noteID?: string; // If provided, update an existing note
}

export class SaveNoteUseCase {
  constructor(private readonly notesRepo: INotesRepository) {}

  async execute(input: SaveNoteInput): Promise<Result<Note, Error>> {
    // Validate required fields
    if (!input.userID) {
      return err(new Error('userID is required'));
    }
    if (!input.content || input.content.trim().length === 0) {
      return err(new Error('Note content cannot be empty'));
    }
    if (input.title && input.title.length > 255) {
      return err(new Error('Title cannot exceed 255 characters'));
    }

    // If noteID is provided, update the existing note
    if (input.noteID) {
      // First, fetch the existing note to ensure it exists and belongs to the user
      const existingResult = await this.notesRepo.getNoteById(input.noteID, input.userID);
      if (existingResult.isFailure()) {
        return existingResult as any;
      }

      const note = existingResult.value;
      // Update only allowed fields
      note.title = input.title ?? note.title;
      note.content = input.content.trim();
      note.taskID = input.taskID ?? note.taskID;
      note.eventID = input.eventID ?? note.eventID;
      note.appointmentID = input.appointmentID ?? note.appointmentID;
      note.meetingID = input.meetingID ?? note.meetingID;
      note.updatedAt = new Date().toISOString();

      return this.notesRepo.updateNote(input.noteID, note);
    }

    // Otherwise, create a new note
    const noteData = {
      userID: input.userID,
      title: input.title || null,
      content: input.content.trim(),
      taskID: input.taskID || null,
      eventID: input.eventID || null,
      appointmentID: input.appointmentID || null,
      meetingID: input.meetingID || null,
      isDeleted: false,
    };

    return this.notesRepo.createNote(
      noteData as Omit<Note, 'noteID' | 'createdAt' | 'updatedAt'>
    );
  }
}