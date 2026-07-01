"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = void 0;
class Note {
    constructor(noteID, userID, content, isDeleted, createdAt, updatedAt, title, taskID, eventID, appointmentID, meetingID) {
        this.noteID = noteID;
        this.userID = userID;
        this.content = content;
        this.isDeleted = isDeleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.title = title;
        this.taskID = taskID;
        this.eventID = eventID;
        this.appointmentID = appointmentID;
        this.meetingID = meetingID;
    }
    /**
     * Factory method to create a Note from a DTO.
     */
    static fromDTO(dto) {
        return new Note(dto.noteID, dto.userID, dto.content, dto.isDeleted, dto.createdAt, dto.updatedAt, dto.title, dto.taskID, dto.eventID, dto.appointmentID, dto.meetingID);
    }
    /**
     * Converts this Note to a DTO.
     */
    toDTO() {
        return {
            noteID: this.noteID,
            userID: this.userID,
            title: this.title,
            content: this.content,
            taskID: this.taskID,
            eventID: this.eventID,
            appointmentID: this.appointmentID,
            meetingID: this.meetingID,
            isDeleted: this.isDeleted,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
    /**
     * Updates the note. Only defined fields are updated.
     */
    update(updates) {
        Object.assign(this, updates);
        this.updatedAt = new Date().toISOString();
    }
    /**
     * Soft‑deletes the note.
     */
    delete() {
        this.isDeleted = true;
        this.updatedAt = new Date().toISOString();
    }
    /**
     * Restores a soft‑deleted note.
     */
    restore() {
        this.isDeleted = false;
        this.updatedAt = new Date().toISOString();
    }
    /**
     * Returns a plain‑text preview of the note (truncated).
     */
    getPreview(maxLength = 100) {
        const clean = this.content.replace(/\n/g, ' ').trim();
        if (clean.length <= maxLength) {
            return clean;
        }
        return clean.substring(0, maxLength) + '…';
    }
}
exports.Note = Note;
//# sourceMappingURL=Note.js.map