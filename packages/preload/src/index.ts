import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '@sphere/shared';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Auth
  login: (email: string, password: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.AUTH_LOGIN, email, password),
  logout: (token: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.AUTH_LOGOUT, token),
  validateToken: (token: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.AUTH_VALIDATE, token),
  signup: (data: any) =>
    ipcRenderer.invoke('ipc:auth:signup', data),
  refreshToken: () =>
    ipcRenderer.invoke('ipc:auth:refresh'),
  getCurrentUser: (token: string) =>
    ipcRenderer.invoke('ipc:auth:me', token),

  // Tasks
  getTasks: (userID: string, filters?: any, pagination?: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.TASKS_GET, userID, filters, pagination),
  createTask: (taskData: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.TASKS_CREATE, taskData),
  updateTask: (taskID: string, updates: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.TASKS_UPDATE, taskID, updates),
  deleteTask: (taskID: string, userID: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.TASKS_DELETE, taskID, userID),
  completeTask: (taskID: string, completionPercentage: number) =>
    ipcRenderer.invoke(IPC_CHANNELS.TASKS_COMPLETE, taskID, completionPercentage),

  // Appointments
  getAppointments: (userID: string, filters?: any, pagination?: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.APPOINTMENTS_GET, userID, filters, pagination),
  createAppointment: (appointmentData: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.APPOINTMENTS_CREATE, appointmentData),
  updateAppointment: (appointmentID: string, updates: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.APPOINTMENTS_UPDATE, appointmentID, updates),
  deleteAppointment: (appointmentID: string, userID: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.APPOINTMENTS_DELETE, appointmentID, userID),
  checkAppointmentConflicts: (userID: string, startDateTime: string, endDateTime: string, excludeID?: string) =>
    ipcRenderer.invoke('ipc:appointments:conflicts', userID, startDateTime, endDateTime, excludeID),

  // Events
  getEvents: (userID: string, filters?: any, pagination?: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.EVENTS_GET, userID, filters, pagination),
  createEvent: (eventData: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.EVENTS_CREATE, eventData),
  updateEvent: (eventID: string, updates: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.EVENTS_UPDATE, eventID, updates),
  deleteEvent: (eventID: string, userID: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.EVENTS_DELETE, eventID, userID),

  // Meetings
  getMeetings: (userID: string, filters?: any, pagination?: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.MEETINGS_GET, userID, filters, pagination),
  createMeeting: (meetingData: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.MEETINGS_CREATE, meetingData),
  updateMeeting: (meetingID: string, updates: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.MEETINGS_UPDATE, meetingID, updates),
  deleteMeeting: (meetingID: string, userID: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.MEETINGS_DELETE, meetingID, userID),
  joinMeeting: (meetingID: string, userID: string, email: string, name: string) =>
    ipcRenderer.invoke('ipc:meetings:join', meetingID, userID, email, name),

  // Notes
  getNotes: (userID: string, filters?: any, pagination?: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.NOTES_GET, userID, filters, pagination),
  createNote: (noteData: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.NOTES_CREATE, noteData),
  updateNote: (noteID: string, updates: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.NOTES_UPDATE, noteID, updates),
  deleteNote: (noteID: string, userID: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.NOTES_DELETE, noteID, userID),

  // Calendar
  syncCalendar: (userID: string, source: string, startDate: string, endDate: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.CALENDAR_SYNC, userID, source, startDate, endDate),
  getCalendarEvents: (userID: string, startDate: string, endDate: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.CALENDAR_GET_EVENTS, userID, startDate, endDate),

  // Chat
  sendMessage: (conversationID: string, senderUserID: string, content: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.CHAT_SEND, conversationID, senderUserID, content),
  getMessages: (conversationID: string, limit: number, before?: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.CHAT_GET_MESSAGES, conversationID, limit, before),
  observeMessages: (conversationID: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.CHAT_OBSERVE, conversationID),
  markMessagesRead: (conversationID: string, userID: string) =>
    ipcRenderer.invoke('ipc:chat:markRead', conversationID, userID),

  // Analytics
  generateReport: (userID: string, options: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.ANALYTICS_GENERATE, userID, options),
  getProductivityScore: (userID: string, date?: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.ANALYTICS_GET_SCORE, userID, date),

  // Settings
  getSettings: (userID: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET, userID),
  updateSettings: (userID: string, updates: any) =>
    ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_UPDATE, userID, updates),

  // Sync
  syncPush: (userID: string) =>
    ipcRenderer.invoke('ipc:sync:push', userID),
  syncPull: (userID: string) =>
    ipcRenderer.invoke('ipc:sync:pull', userID),
  syncStatus: (userID: string) =>
    ipcRenderer.invoke('ipc:sync:status', userID),

  // Window controls
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close'),

  // System
  getAppVersion: () => ipcRenderer.invoke('app:version'),
  getPlatform: () => process.platform,
  openExternal: (url: string) => ipcRenderer.invoke('system:openExternal', url),
});

// Expose additional APIs for development
if (process.env.NODE_ENV === 'development') {
  contextBridge.exposeInMainWorld('__dev', {
    reload: () => ipcRenderer.send('dev:reload'),
    openDevTools: () => ipcRenderer.send('dev:openDevTools'),
  });
}