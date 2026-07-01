"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveNoteUseCase = void 0;
const shared_1 = require("@sphere/shared");
class SaveNoteUseCase {
    constructor(notesRepo) {
        this.notesRepo = notesRepo;
    }
    async execute(input) {
        // Validate required fields
        if (!input.userID) {
            return (0, shared_1.err)(new Error('userID is required'));
        }
        if (!input.content || input.content.trim().length === 0) {
            return (0, shared_1.err)(new Error('Note content cannot be empty'));
        }
        if (input.title && input.title.length > 255) {
            return (0, shared_1.err)(new Error('Title cannot exceed 255 characters'));
        }
        // If noteID is provided, update the existing note
        if (input.noteID) {
            // First, fetch the existing note to ensure it exists and belongs to the user
            const existingResult = await this.notesRepo.getNoteById(input.noteID, input.userID);
            if (existingResult.isFailure()) {
                return existingResult;
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
        return this.notesRepo.createNote(noteData);
    }
}
exports.SaveNoteUseCase = SaveNoteUseCase;
//# sourceMappingURL=SaveNoteUseCase.js.map