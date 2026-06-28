import { Note as NoteDTO } from '@sphere/shared';

export class Note {
  constructor(
    public readonly noteID: string,
    public userID: string,
    public content: string,
    public isDeleted: boolean,
    public createdAt: string,
    public updatedAt: string,
    public title?: string | null,
    public taskID?: string | null,
    public eventID?: string | null,
    public appointmentID?: string | null,
    public meetingID?: string | null
  ) {}

  /**
   * Factory method to create a Note from a DTO.
   */
  static fromDTO(dto: NoteDTO): Note {
    return new Note(
      dto.noteID,
      dto.userID,
      dto.content,
      dto.isDeleted,
      dto.createdAt,
      dto.updatedAt,
      dto.title,
      dto.taskID,
      dto.eventID,
      dto.appointmentID,
      dto.meetingID
    );
  }

  /**
   * Converts this Note to a DTO.
   */
  toDTO(): NoteDTO {
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
  update(updates: Partial<Omit<Note, 'noteID' | 'userID' | 'createdAt'>>): void {
    Object.assign(this, updates);
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Soft‑deletes the note.
   */
  delete(): void {
    this.isDeleted = true;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Restores a soft‑deleted note.
   */
  restore(): void {
    this.isDeleted = false;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Returns a plain‑text preview of the note (truncated).
   */
  getPreview(maxLength: number = 100): string {
    const clean = this.content.replace(/\n/g, ' ').trim();
    if (clean.length <= maxLength) {
      return clean;
    }
    return clean.substring(0, maxLength) + '…';
  }
}