import { err, type Result } from '@sphere/shared';
import { IEventRepository } from '../repositories/IEventRepository';
import { Event } from '../entities/Event';

export interface CreateEventInput {
  userID: string;
  name: string;
  categoryID?: string | null;
  taskID?: string | null;
  format?: string | null;
  planningNotes?: string | null;
  startDateTime?: string | null;
  endDateTime?: string | null;
  isRecurring?: boolean;
  recurrencePattern?: string | null;
}

export class CreateEventUseCase {
  constructor(private readonly eventRepo: IEventRepository) {}

  async execute(input: CreateEventInput): Promise<Result<Event, Error>> {
    // Validate required fields
    if (!input.userID) {
      return err(new Error('userID is required'));
    }
    if (!input.name || input.name.trim().length === 0) {
      return err(new Error('Event name is required'));
    }
    if (input.name.length > 255) {
      return err(new Error('Event name cannot exceed 255 characters'));
    }

    // Validate that start <= end if both provided
    if (input.startDateTime && input.endDateTime) {
      const start = new Date(input.startDateTime);
      const end = new Date(input.endDateTime);
      if (start >= end) {
        return err(new Error('Start time must be before end time'));
      }
    }

    // Create the event entity
    const eventData = {
      userID: input.userID,
      name: input.name.trim(),
      categoryID: input.categoryID || null,
      taskID: input.taskID || null,
      format: input.format || null,
      planningNotes: input.planningNotes || null,
      startDateTime: input.startDateTime || null,
      endDateTime: input.endDateTime || null,
      status: 'planned' as const,
      isRecurring: input.isRecurring || false,
      recurrencePattern: input.recurrencePattern || null,
      isDeleted: false,
    };

    return this.eventRepo.createEvent(
      eventData as Omit<Event, 'eventID' | 'createdAt' | 'updatedAt'>
    );
  }
}