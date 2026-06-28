export interface CalendarEvent {
  id: string;
  source: 'google' | 'outlook' | 'apple';
  externalID: string;
  title: string;
  description?: string | null;
  startDateTime: string;
  endDateTime: string;
  allDayEvent: boolean;
  location?: string | null;
  meetingLink?: string | null;
  color?: string;
  organizer?: string;
  attendees?: string[];
  status: 'confirmed' | 'tentative' | 'cancelled';
  recurrenceRule?: string | null;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}