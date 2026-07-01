"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = exports.User = exports.Task = exports.Note = exports.Appointment = exports.Meeting = exports.Event = exports.CalendarEvent = exports.CreateEventUseCase = exports.EventGetEventsUseCase = exports.SyncCalendarUseCase = exports.CalendarGetEventsUseCase = void 0;
// Auth
__exportStar(require("./auth"), exports);
// Tasks
__exportStar(require("./tasks/entities/Task"), exports);
__exportStar(require("./tasks/repositories/ITaskRepository"), exports);
__exportStar(require("./tasks/use-cases/CreateTaskUseCase"), exports);
__exportStar(require("./tasks/use-cases/GetTasksUseCase"), exports);
__exportStar(require("./tasks/use-cases/CompleteTaskUseCase"), exports);
// Calendar
var GetEventsUseCase_1 = require("./calendar/use-cases/GetEventsUseCase");
Object.defineProperty(exports, "CalendarGetEventsUseCase", { enumerable: true, get: function () { return GetEventsUseCase_1.GetEventsUseCase; } });
var SyncCalendarUseCase_1 = require("./calendar/use-cases/SyncCalendarUseCase");
Object.defineProperty(exports, "SyncCalendarUseCase", { enumerable: true, get: function () { return SyncCalendarUseCase_1.SyncCalendarUseCase; } });
// Meetings
__exportStar(require("./meetings/entities/Meeting"), exports);
__exportStar(require("./meetings/repositories/IMeetingRepository"), exports);
__exportStar(require("./meetings/use-cases/GetMeetingsUseCase"), exports);
__exportStar(require("./meetings/use-cases/JoinMeetingUseCase"), exports);
// Appointments
__exportStar(require("./appointments/entities/Appointment"), exports);
__exportStar(require("./appointments/repositories/IAppointmentRepository"), exports);
__exportStar(require("./appointments/use-cases/BookAppointmentUseCase"), exports);
__exportStar(require("./appointments/use-cases/GetAppointmentsUseCase"), exports);
// Events
var GetEventsUseCase_2 = require("./events/use-cases/GetEventsUseCase");
Object.defineProperty(exports, "EventGetEventsUseCase", { enumerable: true, get: function () { return GetEventsUseCase_2.GetEventsUseCase; } });
var CreateEventUseCase_1 = require("./events/use-cases/CreateEventUseCase");
Object.defineProperty(exports, "CreateEventUseCase", { enumerable: true, get: function () { return CreateEventUseCase_1.CreateEventUseCase; } });
// Chat
__exportStar(require("./chat/entities/Message"), exports);
__exportStar(require("./chat/repositories/IChatRepository"), exports);
__exportStar(require("./chat/use-cases/SendMessageUseCase"), exports);
__exportStar(require("./chat/use-cases/ObserveMessagesUseCase"), exports);
// Notes
__exportStar(require("./notes/entities/Note"), exports);
__exportStar(require("./notes/repositories/INotesRepository"), exports);
__exportStar(require("./notes/use-cases/SaveNoteUseCase"), exports);
__exportStar(require("./notes/use-cases/GetNotesUseCase"), exports);
// Analytics
__exportStar(require("./analytics/entities/AnalyticsData"), exports);
__exportStar(require("./analytics/repositories/IAnalyticsRepository"), exports);
__exportStar(require("./analytics/use-cases/GenerateReportUseCase"), exports);
__exportStar(require("./analytics/use-cases/GetProductivityScoreUseCase"), exports);
// Settings
__exportStar(require("./settings/entities/Settings"), exports);
__exportStar(require("./settings/repositories/ISettingsRepository"), exports);
__exportStar(require("./settings/use-cases/GetSettingsUseCase"), exports);
__exportStar(require("./settings/use-cases/UpdateSettingsUseCase"), exports);
// Re-export calendar and event types that are needed by the data package
// Re-export the class (value) so it can be instantiated
var CalendarEvent_1 = require("./calendar/entities/CalendarEvent");
Object.defineProperty(exports, "CalendarEvent", { enumerable: true, get: function () { return CalendarEvent_1.CalendarEvent; } });
var Event_1 = require("./events/entities/Event");
Object.defineProperty(exports, "Event", { enumerable: true, get: function () { return Event_1.Event; } });
var Meeting_1 = require("./meetings/entities/Meeting");
Object.defineProperty(exports, "Meeting", { enumerable: true, get: function () { return Meeting_1.Meeting; } });
var Appointment_1 = require("./appointments/entities/Appointment");
Object.defineProperty(exports, "Appointment", { enumerable: true, get: function () { return Appointment_1.Appointment; } });
var Note_1 = require("./notes/entities/Note");
Object.defineProperty(exports, "Note", { enumerable: true, get: function () { return Note_1.Note; } });
var Task_1 = require("./tasks/entities/Task");
Object.defineProperty(exports, "Task", { enumerable: true, get: function () { return Task_1.Task; } });
var User_1 = require("./auth/entities/User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
var Settings_1 = require("./settings/entities/Settings");
Object.defineProperty(exports, "Settings", { enumerable: true, get: function () { return Settings_1.Settings; } });
//# sourceMappingURL=index.js.map