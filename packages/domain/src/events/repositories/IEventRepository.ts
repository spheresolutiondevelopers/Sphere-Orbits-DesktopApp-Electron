import { Result } from '@sphere/shared';
import { Event } from '../entities/Event';

export interface EventFilters {
  status?: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  categoryID?: string;
  startDateFrom?: string;
  startDateTo?: string;
  search?: string;
}

export interface PaginationOptions {
  limit: number;
  offset: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

export interface IEventRepository {
  /**
   * Gets events for the current user with optional filters and pagination.
   */
  getEvents(
    userID: string,
    filters?: EventFilters,
    pagination?: PaginationOptions
  ): Promise<Result<PaginatedResult<Event>, Error>>;

  /**
   * Gets a single event by ID.
   */
  getEventById(eventID: string, userID: string): Promise<Result<Event, Error>>;

  /**
   * Creates a new event.
   */
  createEvent(
    event: Omit<Event, 'eventID' | 'createdAt' | 'updatedAt'>
  ): Promise<Result<Event, Error>>;

  /**
   * Updates an existing event.
   */
  updateEvent(
    eventID: string,
    updates: Partial<Event>
  ): Promise<Result<Event, Error>>;

  /**
   * Deletes an event (soft‑delete).
   */
  deleteEvent(eventID: string, userID: string): Promise<Result<void, Error>>;

  /**
   * Gets all events that need to be synced.
   */
  getEventsForSync(userID: string): Promise<Result<Event[], Error>>;

  /**
   * Marks an event as synced.
   */
  markEventSynced(eventID: string): Promise<Result<void, Error>>;
}