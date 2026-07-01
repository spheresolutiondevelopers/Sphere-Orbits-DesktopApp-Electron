import { Meeting as MeetingDTO } from '@sphere/shared';
export declare class Meeting {
    readonly meetingID: string;
    taskID: string;
    organizerUserID: string;
    title: string;
    startDateTime: string;
    endDateTime: string;
    status: 'scheduled' | 'live' | 'ended' | 'cancelled';
    isRecurring: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    description?: string | null | undefined;
    meetingLink?: string | null | undefined;
    meetingPlatform?: string | null | undefined;
    recurrencePattern?: string | null | undefined;
    constructor(meetingID: string, taskID: string, organizerUserID: string, title: string, startDateTime: string, endDateTime: string, status: 'scheduled' | 'live' | 'ended' | 'cancelled', isRecurring: boolean, isDeleted: boolean, createdAt: string, updatedAt: string, description?: string | null | undefined, meetingLink?: string | null | undefined, meetingPlatform?: string | null | undefined, recurrencePattern?: string | null | undefined);
    /**
     * Factory method to create a Meeting from a DTO.
     */
    static fromDTO(dto: MeetingDTO): Meeting;
    /**
     * Converts this Meeting to a DTO.
     */
    toDTO(): MeetingDTO;
    /**
     * Updates the meeting. Only defined fields are updated.
     */
    update(updates: Partial<Omit<Meeting, 'meetingID' | 'organizerUserID' | 'createdAt'>>): void;
    /**
     * Marks the meeting as live.
     */
    start(): void;
    /**
     * Marks the meeting as ended.
     */
    end(): void;
    /**
     * Cancels the meeting.
     */
    cancel(): void;
    /**
     * Checks if the meeting is currently live.
     */
    isLive(currentDate?: string): boolean;
    /**
     * Checks if the meeting is in the future.
     */
    isFuture(currentDate?: string): boolean;
    /**
     * Checks if the meeting is in the past.
     */
    isPast(currentDate?: string): boolean;
}
//# sourceMappingURL=Meeting.d.ts.map