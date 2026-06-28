import axios, { AxiosInstance } from 'axios';
import { CalendarEvent } from '@sphere/domain';

export class GoogleCalendarApi {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL: 'https://www.googleapis.com/calendar/v3',
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  setAuthToken(token: string): void {
    this.accessToken = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Fetches events from Google Calendar for a date range.
   */
  async getEvents(startDate: string, endDate: string): Promise<CalendarEvent[]> {
    if (!this.accessToken) {
      throw new Error('Google Calendar API requires an access token');
    }

    const response = await this.client.get('/calendars/primary/events', {
      params: {
        timeMin: startDate,
        timeMax: endDate,
        singleEvents: true,
        orderBy: 'startTime',
      },
    });

    const items = response.data.items || [];
    return items.map((item: any) => this.mapGoogleEventToCalendarEvent(item));
  }

  /**
   * Creates a new event in Google Calendar.
   */
  async createEvent(
    event: Omit<CalendarEvent, 'id' | 'source' | 'externalID' | 'createdAt' | 'updatedAt'>
  ): Promise<CalendarEvent> {
    if (!this.accessToken) {
      throw new Error('Google Calendar API requires an access token');
    }

    const googleEvent = {
      summary: event.title,
      description: event.description || '',
      location: event.location || '',
      start: {
        dateTime: event.startDateTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: event.endDateTime,
        timeZone: 'UTC',
      },
      attendees: event.attendees?.map((email) => ({ email })),
      colorId: this.mapColorToGoogleColor(event.color || '#2196F3'),
      recurrence: event.recurrenceRule ? [event.recurrenceRule] : undefined,
    };

    const response = await this.client.post('/calendars/primary/events', googleEvent);
    return this.mapGoogleEventToCalendarEvent(response.data);
  }

  /**
   * Updates an existing event in Google Calendar.
   */
  async updateEvent(
    externalID: string,
    updates: Partial<Omit<CalendarEvent, 'id' | 'source' | 'externalID' | 'createdAt' | 'updatedAt'>>
  ): Promise<CalendarEvent> {
    if (!this.accessToken) {
      throw new Error('Google Calendar API requires an access token');
    }

    const googleUpdate: any = {};
    if (updates.title) googleUpdate.summary = updates.title;
    if (updates.description !== undefined) googleUpdate.description = updates.description || '';
    if (updates.location !== undefined) googleUpdate.location = updates.location || '';
    if (updates.startDateTime) {
      googleUpdate.start = { dateTime: updates.startDateTime, timeZone: 'UTC' };
    }
    if (updates.endDateTime) {
      googleUpdate.end = { dateTime: updates.endDateTime, timeZone: 'UTC' };
    }
    if (updates.attendees !== undefined) {
      googleUpdate.attendees = updates.attendees?.map((email) => ({ email }));
    }
    if (updates.color) {
      googleUpdate.colorId = this.mapColorToGoogleColor(updates.color);
    }
    if (updates.recurrenceRule !== undefined) {
      googleUpdate.recurrence = updates.recurrenceRule ? [updates.recurrenceRule] : [];
    }

    const response = await this.client.patch(`/calendars/primary/events/${externalID}`, googleUpdate);
    return this.mapGoogleEventToCalendarEvent(response.data);
  }

  /**
   * Deletes an event from Google Calendar.
   */
  async deleteEvent(externalID: string): Promise<void> {
    if (!this.accessToken) {
      throw new Error('Google Calendar API requires an access token');
    }
    await this.client.delete(`/calendars/primary/events/${externalID}`);
  }

  /**
   * Maps a Google Calendar event to our CalendarEvent format.
   */
  private mapGoogleEventToCalendarEvent(item: any): CalendarEvent {
    return {
      id: crypto.randomUUID(),
      source: 'google',
      externalID: item.id,
      title: item.summary || 'Untitled Event',
      description: item.description || null,
      startDateTime: item.start.dateTime || item.start.date,
      endDateTime: item.end.dateTime || item.end.date,
      allDayEvent: !!item.start.date,
      location: item.location || null,
      meetingLink: null, // Google Meet links are in hangoutLink
      color: this.mapGoogleColorToColor(item.colorId),
      organizer: item.organizer?.email || null,
      attendees: item.attendees?.map((a: any) => a.email) || [],
      status: item.status || 'confirmed',
      recurrenceRule: item.recurrence?.[0] || null,
      isRecurring: !!item.recurringEventId || !!item.recurrence,
      createdAt: item.created || new Date().toISOString(),
      updatedAt: item.updated || new Date().toISOString(),
    };
  }

  /**
   * Maps our color to Google Calendar colorId.
   */
  private mapColorToGoogleColor(color: string): string | undefined {
    const mapping: Record<string, string> = {
      '#2196F3': '1', // Blue
      '#4CAF50': '2', // Green
      '#FFC107': '3', // Yellow
      '#F44336': '4', // Red
      '#9C27B0': '5', // Purple
      '#FF9800': '6', // Orange
      '#00BCD4': '7', // Cyan
      '#FF6B8A': '8', // Pink
      '#7C6CF8': '9', // Indigo
    };
    return mapping[color];
  }

  /**
   * Maps Google Calendar colorId to our color.
   */
  private mapGoogleColorToColor(colorId: string | undefined): string | null {
    const mapping: Record<string, string> = {
      '1': '#2196F3',
      '2': '#4CAF50',
      '3': '#FFC107',
      '4': '#F44336',
      '5': '#9C27B0',
      '6': '#FF9800',
      '7': '#00BCD4',
      '8': '#FF6B8A',
      '9': '#7C6CF8',
    };
    return colorId ? mapping[colorId] || null : null;
  }
}