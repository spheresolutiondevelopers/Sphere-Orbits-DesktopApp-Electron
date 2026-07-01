"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
class Event {
    constructor(eventID, userID, name, status, isRecurring, isDeleted, createdAt, updatedAt, categoryID, taskID, format, planningNotes, startDateTime, endDateTime, recurrencePattern) {
        this.eventID = eventID;
        this.userID = userID;
        this.name = name;
        this.status = status;
        this.isRecurring = isRecurring;
        this.isDeleted = isDeleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.categoryID = categoryID;
        this.taskID = taskID;
        this.format = format;
        this.planningNotes = planningNotes;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.recurrencePattern = recurrencePattern;
    }
    /**
     * Factory method to create an Event from a DTO.
     */
    static fromDTO(dto) {
        return new Event(dto.eventID, dto.userID, dto.name, dto.status, dto.isRecurring, dto.isDeleted, dto.createdAt, dto.updatedAt, dto.categoryID, dto.taskID, dto.format, dto.planningNotes, dto.startDateTime, dto.endDateTime, dto.recurrencePattern);
    }
    /**
     * Converts this Event to a DTO.
     */
    toDTO() {
        return {
            eventID: this.eventID,
            userID: this.userID,
            categoryID: this.categoryID,
            taskID: this.taskID,
            name: this.name,
            format: this.format,
            planningNotes: this.planningNotes,
            startDateTime: this.startDateTime,
            endDateTime: this.endDateTime,
            status: this.status,
            isRecurring: this.isRecurring,
            recurrencePattern: this.recurrencePattern,
            isDeleted: this.isDeleted,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
    /**
     * Updates the event. Only defined fields are updated.
     */
    update(updates) {
        Object.assign(this, updates);
        this.updatedAt = new Date().toISOString();
    }
    /**
     * Marks the event as ongoing.
     */
    start() {
        if (this.status === 'planned') {
            this.status = 'ongoing';
            this.updatedAt = new Date().toISOString();
        }
    }
    /**
     * Marks the event as completed.
     */
    complete() {
        if (this.status !== 'cancelled') {
            this.status = 'completed';
            this.updatedAt = new Date().toISOString();
        }
    }
    /**
     * Cancels the event.
     */
    cancel() {
        if (this.status !== 'completed') {
            this.status = 'cancelled';
            this.updatedAt = new Date().toISOString();
        }
    }
    /**
     * Checks if the event is currently ongoing.
     */
    isOngoing(currentDate = new Date().toISOString()) {
        if (this.status !== 'ongoing' && this.status !== 'planned') {
            return false;
        }
        if (!this.startDateTime || !this.endDateTime) {
            return this.status === 'ongoing';
        }
        const now = new Date(currentDate);
        const start = new Date(this.startDateTime);
        const end = new Date(this.endDateTime);
        return now >= start && now <= end;
    }
    /**
     * Checks if the event is in the future.
     */
    isFuture(currentDate = new Date().toISOString()) {
        if (this.status === 'completed' || this.status === 'cancelled') {
            return false;
        }
        if (!this.startDateTime) {
            return false;
        }
        return new Date(this.startDateTime) > new Date(currentDate);
    }
    /**
     * Checks if the event is in the past.
     */
    isPast(currentDate = new Date().toISOString()) {
        if (this.status === 'completed' || this.status === 'cancelled') {
            return true;
        }
        if (!this.endDateTime) {
            return false;
        }
        return new Date(this.endDateTime) < new Date(currentDate);
    }
}
exports.Event = Event;
//# sourceMappingURL=Event.js.map