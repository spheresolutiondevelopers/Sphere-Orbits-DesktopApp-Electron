export interface Note {
  noteID: string;
  userID: string;
  title?: string | null;
  content: string;
  taskID?: string | null;
  eventID?: string | null;
  appointmentID?: string | null;
  meetingID?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}