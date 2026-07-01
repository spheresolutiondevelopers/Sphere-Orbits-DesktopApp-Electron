"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meeting = void 0;
class Meeting {
    constructor(meetingID, taskID, organizerUserID, title, startDateTime, endDateTime, status, isRecurring, isDeleted, createdAt, updatedAt, description, meetingLink, meetingPlatform, recurrencePattern) {
        this.meetingID = meetingID;
        this.taskID = taskID;
        this.organizerUserID = organizerUserID;
        this.title = title;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.status = status;
        this.isRecurring = isRecurring;
        this.isDeleted = isDeleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.description = description;
        this.meetingLink = meetingLink;
        this.meetingPlatform = meetingPlatform;
        this.recurrencePattern = recurrencePattern;
    }
    /**
     * Factory method to create a Meeting from a DTO.
     */
    static fromDTO(dto) {
        return new Meeting(dto.meetingID, dto.taskID, dto.organizerUserID, dto.title, dto.startDateTime, dto.endDateTime, dto.status, dto.isRecurring, dto.isDeleted, dto.createdAt, dto.updatedAt, dto.description, dto.meetingLink, dto.meetingPlatform, dto.recurrencePattern);
    }
    /**
     * Converts this Meeting to a DTO.
     */
    toDTO() {
        return {
            meetingID: this.meetingID,
            taskID: this.taskID,
            organizerUserID: this.organizerUserID,
            title: this.title,
            description: this.description,
            startDateTime: this.startDateTime,
            endDateTime: this.endDateTime,
            meetingLink: this.meetingLink,
            meetingPlatform: this.meetingPlatform,
            isRecurring: this.isRecurring,
            recurrencePattern: this.recurrencePattern,
            status: this.status,
            isDeleted: this.isDeleted,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
    /**
     * Updates the meeting. Only defined fields are updated.
     */
    update(updates) {
        Object.assign(this, updates);
        this.updatedAt = new Date().toISOString();
    }
    /**
     * Marks the meeting as live.
     */
    start() {
        if (this.status === 'scheduled') {
            this.status = 'live';
            this.updatedAt = new Date().toISOString();
        }
        else {
            throw new Error(`Cannot start meeting with status: ${this.status}`);
        }
    }
    /**
     * Marks the meeting as ended.
     */
    end() {
        if (this.status === 'live') {
            this.status = 'ended';
            this.updatedAt = new Date().toISOString();
        }
        else {
            throw new Error(`Cannot end meeting with status: ${this.status}`);
        }
    }
    /**
     * Cancels the meeting.
     */
    cancel() {
        if (this.status !== 'cancelled') {
            this.status = 'cancelled';
            this.updatedAt = new Date().toISOString();
        }
    }
    /**
     * Checks if the meeting is currently live.
     */
    isLive(currentDate = new Date().toISOString()) {
        if (this.status !== 'scheduled' && this.status !== 'live') {
            return false;
        }
        const now = new Date(currentDate);
        const start = new Date(this.startDateTime);
        const end = new Date(this.endDateTime);
        return now >= start && now <= end;
    }
    /**
     * Checks if the meeting is in the future.
     */
    isFuture(currentDate = new Date().toISOString()) {
        return new Date(this.startDateTime) > new Date(currentDate);
    }
    /**
     * Checks if the meeting is in the past.
     */
    isPast(currentDate = new Date().toISOString()) {
        return new Date(this.endDateTime) < new Date(currentDate);
    }
}
exports.Meeting = Meeting;
//# sourceMappingURL=Meeting.js.map