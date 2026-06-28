import { Result } from '@sphere/shared';
import { CalendarEvent } from '../entities/CalendarEvent';

export interface ICalendarRepository {
  /**
   * Fetches events from an external calendar source.
   */
  getEvents(
    source: 'google' | 'outlook' | 'apple',
    startDate: string,
    endDate: string
  ): Promise<Result<CalendarEvent[], Error>>;

  /**
   * Synchronises events between the local database and an external calendar.
   * This is a two‑way sync: pushes local changes and pulls remote changes.
   */
  syncCalendar(
    userID: string,
    source: 'google' | 'outlook' | 'apple',
    startDate: string,
    endDate: string
  ): Promise<Result<{ syncedCount: number; errors: string[] }, Error>>;

  /**
   * Creates an event in the external calendar.
   */
  createRemoteEvent(
    source: 'google' | 'outlook' | 'apple',
    event: Omit<CalendarEvent, 'id' | 'source' | 'externalID' | 'createdAt' | 'updatedAt'>
  ): Promise<Result<CalendarEvent, Error>>;

  /**
   * Updates an event in the external calendar.
   */
  updateRemoteEvent(
    source: 'google' | 'outlook' | 'apple',
    externalID: string,
    updates: Partial<Omit<CalendarEvent, 'id' | 'source' | 'externalID' | 'createdAt' | 'updatedAt'>>
  ): Promise<Result<CalendarEvent, Error>>;

  /**
   * Deletes an event from the external calendar.
   */
  deleteRemoteEvent(
    source: 'google' | 'outlook' | 'apple',
    externalID: string
  ): Promise<Result<void, Error>>;

  /**
   * Stores a synced event locally (to avoid re‑syncing).
   */
  storeSyncedEvent(userID: string, event: CalendarEvent): Promise<Result<void, Error>>;

  /**
   * Retrieves events stored locally (from previous syncs).
   */
  getLocalEvents(
    userID: string,
    startDate: string,
    endDate: string
  ): Promise<Result<CalendarEvent[], Error>>;
}