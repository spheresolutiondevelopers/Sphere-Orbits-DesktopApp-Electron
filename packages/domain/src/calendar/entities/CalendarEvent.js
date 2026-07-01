"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarEvent = void 0;
class CalendarEvent {
    constructor(id, source, externalID, title, startDateTime, endDateTime, allDayEvent, status, isRecurring, createdAt, updatedAt, description, location, meetingLink, color, organizer, attendees, recurrenceRule) {
        this.id = id;
        this.source = source;
        this.externalID = externalID;
        this.title = title;
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
        this.allDayEvent = allDayEvent;
        this.status = status;
        this.isRecurring = isRecurring;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.description = description;
        this.location = location;
        this.meetingLink = meetingLink;
        this.color = color;
        this.organizer = organizer;
        this.attendees = attendees;
        this.recurrenceRule = recurrenceRule;
    }
    /**
     * Factory method to create a CalendarEvent from a DTO.
     */
    static fromDTO(dto) {
        return new CalendarEvent(dto.id, dto.source, dto.externalID, dto.title, dto.startDateTime, dto.endDateTime, dto.allDayEvent, dto.status, dto.isRecurring, dto.createdAt, dto.updatedAt, dto.description, dto.location, dto.meetingLink, dto.color, dto.organizer, dto.attendees, dto.recurrenceRule);
    }
    /**
     * Converts this CalendarEvent to a DTO.
     */
    toDTO() {
        return {
            id: this.id,
            source: this.source,
            externalID: this.externalID,
            title: this.title,
            description: this.description,
            startDateTime: this.startDateTime,
            endDateTime: this.endDateTime,
            allDayEvent: this.allDayEvent,
            location: this.location,
            meetingLink: this.meetingLink,
            color: this.color,
            organizer: this.organizer,
            attendees: this.attendees,
            status: this.status,
            recurrenceRule: this.recurrenceRule,
            isRecurring: this.isRecurring,
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
     * Checks if the event is currently ongoing.
     */
    isOngoing(currentDate = new Date().toISOString()) {
        const now = new Date(currentDate);
        const start = new Date(this.startDateTime);
        const end = new Date(this.endDateTime);
        return now >= start && now <= end;
    }
    /**
     * Checks if the event is in the future.
     */
    isFuture(currentDate = new Date().toISOString()) {
        return new Date(this.startDateTime) > new Date(currentDate);
    }
    /**
     * Checks if the event is in the past.
     */
    isPast(currentDate = new Date().toISOString()) {
        return new Date(this.endDateTime) < new Date(currentDate);
    }
}
exports.CalendarEvent = CalendarEvent;
//# sourceMappingURL=CalendarEvent.js.map