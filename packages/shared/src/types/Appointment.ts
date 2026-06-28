export interface Appointment {
  appointmentID: string;
  userID: string;
  title: string;
  description?: string | null;
  appointmentType: 'general' | 'doctor' | 'business' | 'personal';
  startDateTime: string; // ISO 8601
  endDateTime: string; // ISO 8601
  allDayEvent: boolean;
  location?: string | null;
  isVirtual: boolean;
  meetingLink?: string | null;
  meetingPlatform?: string | null;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';
  reminderMinutesBefore: number;
  isRecurring: boolean;
  recurrencePattern?: string | null;
  calendarColor: string; // #hex
  externalEventID?: string | null;
  externalSyncStatus: 'not_synced' | 'synced' | 'failed';
  notes?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}