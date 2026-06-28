export interface Event {
  eventID: string;
  userID: string;
  categoryID?: string | null;
  taskID?: string | null;
  name: string;
  format?: string | null;
  planningNotes?: string | null;
  startDateTime?: string | null;
  endDateTime?: string | null;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  isRecurring: boolean;
  recurrencePattern?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}