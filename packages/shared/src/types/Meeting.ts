export interface Meeting {
  meetingID: string;
  taskID: string;
  organizerUserID: string;
  title: string;
  description?: string | null;
  startDateTime: string;
  endDateTime: string;
  meetingLink?: string | null;
  meetingPlatform?: string | null;
  isRecurring: boolean;
  recurrencePattern?: string | null;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}