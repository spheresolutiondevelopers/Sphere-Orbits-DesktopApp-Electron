import { Event as EventDTO } from '@sphere/shared';
export declare class Event {
    readonly eventID: string;
    userID: string;
    name: string;
    status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
    isRecurring: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    categoryID?: string | null | undefined;
    taskID?: string | null | undefined;
    format?: string | null | undefined;
    planningNotes?: string | null | undefined;
    startDateTime?: string | null | undefined;
    endDateTime?: string | null | undefined;
    recurrencePattern?: string | null | undefined;
    constructor(eventID: string, userID: string, name: string, status: 'planned' | 'ongoing' | 'completed' | 'cancelled', isRecurring: boolean, isDeleted: boolean, createdAt: string, updatedAt: string, categoryID?: string | null | undefined, taskID?: string | null | undefined, format?: string | null | undefined, planningNotes?: string | null | undefined, startDateTime?: string | null | undefined, endDateTime?: string | null | undefined, recurrencePattern?: string | null | undefined);
    /**
     * Factory method to create an Event from a DTO.
     */
    static fromDTO(dto: EventDTO): Event;
    /**
     * Converts this Event to a DTO.
     */
    toDTO(): EventDTO;
    /**
     * Updates the event. Only defined fields are updated.
     */
    update(updates: Partial<Omit<Event, 'eventID' | 'userID' | 'createdAt'>>): void;
    /**
     * Marks the event as ongoing.
     */
    start(): void;
    /**
     * Marks the event as completed.
     */
    complete(): void;
    /**
     * Cancels the event.
     */
    cancel(): void;
    /**
     * Checks if the event is currently ongoing.
     */
    isOngoing(currentDate?: string): boolean;
    /**
     * Checks if the event is in the future.
     */
    isFuture(currentDate?: string): boolean;
    /**
     * Checks if the event is in the past.
     */
    isPast(currentDate?: string): boolean;
}
//# sourceMappingURL=Event.d.ts.map