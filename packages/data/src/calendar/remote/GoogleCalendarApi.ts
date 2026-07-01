import { randomUUID } from 'node:crypto';
import axios, { AxiosInstance } from 'axios';
import { CalendarEvent } from '@sphere/domain';

export class GoogleCalendarApi {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor(_baseURL: string) {
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
   * Returns CalendarEvent instances.
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
   * Returns a CalendarEvent instance.
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
      attendees: event.attendees?.map((email: string) => ({ email })),
      colorId: this.mapColorToGoogleColor(event.color || '#2196F3'),
      recurrence: event.recurrenceRule ? [event.recurrenceRule] : undefined,
    };

    const response = await this.client.post('/calendars/primary/events', googleEvent);
    return this.mapGoogleEventToCalendarEvent(response.data);
  }

  /**
   * Updates an existing event in Google Calendar.
   * Returns a CalendarEvent instance.
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
      googleUpdate.attendees = updates.attendees?.map((email: string) => ({ email }));
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
   * Maps a Google Calendar event to a CalendarEvent instance.
   * 
   * IMPORTANT: The CalendarEvent class constructor expects:
   * - color: string | undefined (not null)
   * - recurrenceRule: string | null | undefined
   */
  private mapGoogleEventToCalendarEvent(item: any): CalendarEvent {
    // Convert colorId to color string, or undefined if not found
    const color = this.mapGoogleColorToColor(item.colorId) || undefined;
    
    // Get attendees as string array
    const attendees: string[] = item.attendees?.map((a: any) => a.email) || [];

    // Determine if it's an all-day event (has date but not dateTime)
    const allDayEvent = !!item.start?.date;

    // Get the recurrence rule
    const recurrenceRule = item.recurrence?.[0] || null;

    // Create a CalendarEvent instance using the class constructor
    // This ensures we get a proper domain object with all methods
    return new CalendarEvent(
      randomUUID(),                    // id (generate new UUID)
      'google',                        // source
      item.id,                         // externalID
      item.summary || 'Untitled Event', // title
      item.start?.dateTime || item.start?.date || new Date().toISOString(), // startDateTime
      item.end?.dateTime || item.end?.date || new Date().toISOString(),   // endDateTime
      allDayEvent,                     // allDayEvent
      item.status || 'confirmed',      // status
      !!item.recurringEventId || !!item.recurrence, // isRecurring
      item.created || new Date().toISOString(), // createdAt
      item.updated || new Date().toISOString(), // updatedAt
      item.description || null,        // description (optional)
      item.location || null,           // location (optional)
      null,                            // meetingLink (Google Meet links not available via API)
      color,                           // color (string | undefined)
      item.organizer?.email || null,   // organizer (optional)
      attendees,                       // attendees (optional)
      recurrenceRule                   // recurrenceRule (optional)
    );
  }

  /**
   * Maps our color to Google Calendar colorId.
   */
  private mapColorToGoogleColor(color: string): string | undefined {
    const mapping: Record<string, string> = {
      '#2196F3': '1',
      '#4CAF50': '2',
      '#FFC107': '3',
      '#F44336': '4',
      '#9C27B0': '5',
      '#FF9800': '6',
      '#00BCD4': '7',
      '#FF6B8A': '8',
      '#7C6CF8': '9',
    };
    return mapping[color];
  }

  /**
   * Maps Google Calendar colorId to our color.
   * Returns string | undefined (not null) to match domain type.
   */
  private mapGoogleColorToColor(colorId: string | undefined): string | undefined {
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
    // Return undefined instead of null to match domain type
    return colorId ? mapping[colorId] : undefined;
  }
}