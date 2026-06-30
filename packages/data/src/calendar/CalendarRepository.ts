import { ok, err, type Result } from '@sphere/shared';
import { CalendarEvent, ICalendarRepository } from '@sphere/domain';
import { DatabaseClient } from '../database/DatabaseClient';
import { EventDao } from './local/EventDao';
import { GoogleCalendarApi } from './remote/GoogleCalendarApi';

export class CalendarRepository implements ICalendarRepository {
  private eventDao: EventDao;
  private googleApi: GoogleCalendarApi;

  constructor(db: DatabaseClient, apiBaseURL: string) {
    this.eventDao = new EventDao(db);
    this.googleApi = new GoogleCalendarApi(apiBaseURL);
  }

  setAuthToken(token: string): void {
    this.googleApi.setAuthToken(token);
  }

  async getEvents(
    source: 'google' | 'outlook' | 'apple',
    startDate: string,
    endDate: string
  ): Promise<Result<CalendarEvent[], Error>> {
    try {
      if (source === 'google') {
        const events = await this.googleApi.getEvents(startDate, endDate);
        return ok(events);
      }
      // For outlook/apple, would implement similar logic
      return err(new Error(`Calendar source ${source} not implemented yet`));
    } catch (error: any) {
      return err(error);
    }
  }

  async syncCalendar(
    userID: string,
    source: 'google' | 'outlook' | 'apple',
    startDate: string,
    endDate: string
  ): Promise<Result<{ syncedCount: number; errors: string[] }, Error>> {
    try {
      const errors: string[] = [];
      let syncedCount = 0;

      // Fetch remote events
      const eventsResult = await this.getEvents(source, startDate, endDate);
      if (eventsResult.isFailure()) {
        return err(eventsResult.error);
      }

      const remoteEvents = eventsResult.value;

      // For each event, store locally
      for (const event of remoteEvents) {
        try {
          await this.eventDao.upsertEvent(userID, event);
          syncedCount++;
        } catch (error: any) {
          errors.push(`Failed to sync event ${event.id}: ${error.message}`);
        }
      }

      return ok({ syncedCount, errors });
    } catch (error: any) {
      return err(error);
    }
  }

  async createRemoteEvent(
    source: 'google' | 'outlook' | 'apple',
    event: Omit<CalendarEvent, 'id' | 'source' | 'externalID' | 'createdAt' | 'updatedAt'>
  ): Promise<Result<CalendarEvent, Error>> {
    try {
      if (source === 'google') {
        const created = await this.googleApi.createEvent(event);
        return ok(created);
      }
      return err(new Error(`Calendar source ${source} not implemented yet`));
    } catch (error: any) {
      return err(error);
    }
  }

  async updateRemoteEvent(
    source: 'google' | 'outlook' | 'apple',
    externalID: string,
    updates: Partial<Omit<CalendarEvent, 'id' | 'source' | 'externalID' | 'createdAt' | 'updatedAt'>>
  ): Promise<Result<CalendarEvent, Error>> {
    try {
      if (source === 'google') {
        const updated = await this.googleApi.updateEvent(externalID, updates);
        return ok(updated);
      }
      return err(new Error(`Calendar source ${source} not implemented yet`));
    } catch (error: any) {
      return err(error);
    }
  }

  async deleteRemoteEvent(
    source: 'google' | 'outlook' | 'apple',
    externalID: string
  ): Promise<Result<void, Error>> {
    try {
      if (source === 'google') {
        await this.googleApi.deleteEvent(externalID);
        return ok(undefined);
      }
      return err(new Error(`Calendar source ${source} not implemented yet`));
    } catch (error: any) {
      return err(error);
    }
  }

  async storeSyncedEvent(userID: string, event: CalendarEvent): Promise<Result<void, Error>> {
    try {
      await this.eventDao.upsertEvent(userID, event);
      return ok(undefined);
    } catch (error: any) {
      return err(error);
    }
  }

  async getLocalEvents(
    userID: string,
    startDate: string,
    endDate: string
  ): Promise<Result<CalendarEvent[], Error>> {
    try {
      const events = await this.eventDao.getEvents(userID, startDate, endDate);
      return ok(events);
    } catch (error: any) {
      return err(error);
    }
  }
}