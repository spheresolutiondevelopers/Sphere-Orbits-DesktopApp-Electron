import { CalendarEvent as CalendarEventDTO } from '@sphere/shared';
export declare class CalendarEvent {
    readonly id: string;
    source: 'google' | 'outlook' | 'apple';
    externalID: string;
    title: string;
    startDateTime: string;
    endDateTime: string;
    allDayEvent: boolean;
    status: 'confirmed' | 'tentative' | 'cancelled';
    isRecurring: boolean;
    createdAt: string;
    updatedAt: string;
    description?: string | null | undefined;
    location?: string | null | undefined;
    meetingLink?: string | null | undefined;
    color?: string | undefined;
    organizer?: string | undefined;
    attendees?: string[] | undefined;
    recurrenceRule?: string | null | undefined;
    constructor(id: string, source: 'google' | 'outlook' | 'apple', externalID: string, title: string, startDateTime: string, endDateTime: string, allDayEvent: boolean, status: 'confirmed' | 'tentative' | 'cancelled', isRecurring: boolean, createdAt: string, updatedAt: string, description?: string | null | undefined, location?: string | null | undefined, meetingLink?: string | null | undefined, color?: string | undefined, organizer?: string | undefined, attendees?: string[] | undefined, recurrenceRule?: string | null | undefined);
    /**
     * Factory method to create a CalendarEvent from a DTO.
     */
    static fromDTO(dto: CalendarEventDTO): CalendarEvent;
    /**
     * Converts this CalendarEvent to a DTO.
     */
    toDTO(): CalendarEventDTO;
    /**
     * Updates the event. Only defined fields are updated.
     */
    update(updates: Partial<Omit<CalendarEvent, 'id' | 'source' | 'externalID' | 'createdAt'>>): void;
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
//# sourceMappingURL=CalendarEvent.d.ts.map