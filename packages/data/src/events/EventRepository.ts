import { Result, EventSchema } from '@sphere/shared';
import { Event, IEventRepository, EventFilters, PaginationOptions, PaginatedResult } from '@sphere/domain';
import { DatabaseClient } from '../database/DatabaseClient';
import { EventDao } from './local/EventDao';

export class EventRepository implements IEventRepository {
  private eventDao: EventDao;

  constructor(db: DatabaseClient) {
    this.eventDao = new EventDao(db);
  }

  async getEvents(
    userID: string,
    filters?: EventFilters,
    pagination?: PaginationOptions
  ): Promise<Result<PaginatedResult<Event>, Error>> {
    try {
      const result = await this.eventDao.getEvents(userID, filters, pagination);
      return Result.ok(result);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async getEventById(eventID: string, userID: string): Promise<Result<Event, Error>> {
    try {
      const event = await this.eventDao.getEventById(eventID, userID);
      if (!event) {
        return Result.err(new Error('Event not found'));
      }
      return Result.ok(event);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async createEvent(
    event: Omit<Event, 'eventID' | 'createdAt' | 'updatedAt'>
  ): Promise<Result<Event, Error>> {
    try {
      // Validate with Zod
      const validation = EventSchema.omit({
        eventID: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
        userID: true,
      }).safeParse(event);
      if (!validation.success) {
        return Result.err(new Error(validation.error.message));
      }

      // Validate that start <= end if both provided
      if (event.startDateTime && event.endDateTime) {
        const start = new Date(event.startDateTime);
        const end = new Date(event.endDateTime);
        if (start >= end) {
          return Result.err(new Error('Start time must be before end time'));
        }
      }

      const created = await this.eventDao.createEvent(event);
      return Result.ok(created);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async updateEvent(eventID: string, updates: Partial<Event>): Promise<Result<Event, Error>> {
    try {
      // Validate partial updates
      const validation = EventSchema.partial().safeParse(updates);
      if (!validation.success) {
        return Result.err(new Error(validation.error.message));
      }

      const updated = await this.eventDao.updateEvent(eventID, updates);
      if (!updated) {
        return Result.err(new Error('Event not found'));
      }
      return Result.ok(updated);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async deleteEvent(eventID: string, userID: string): Promise<Result<void, Error>> {
    try {
      await this.eventDao.softDelete(eventID, userID);
      return Result.ok(undefined);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async getEventsForSync(userID: string): Promise<Result<Event[], Error>> {
    try {
      const events = await this.eventDao.getEventsForSync(userID);
      return Result.ok(events);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async markEventSynced(eventID: string): Promise<Result<void, Error>> {
    try {
      await this.eventDao.markSynced(eventID);
      return Result.ok(undefined);
    } catch (error: any) {
      return Result.err(error);
    }
  }
}