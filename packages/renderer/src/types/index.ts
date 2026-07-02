// Global type declarations
export {};

declare global {
  interface Window {
    electronAPI: {
      // Auth
      login: (email: string, password: string) => Promise<{ success: boolean; data?: any; error?: string }>;
      logout: (token: string) => Promise<{ success: boolean; error?: string }>;
      validateToken: (token: string) => Promise<{ success: boolean; data?: any; error?: string }>;
      signup: (data: any) => Promise<{ success: boolean; data?: any; error?: string }>;
      refreshToken: () => Promise<{ success: boolean; data?: any; error?: string }>;
      getCurrentUser: (token: string) => Promise<{ success: boolean; data?: any; error?: string }>;

      // Tasks
      getTasks: (userID: string, filters?: any, pagination?: any) => Promise<{ success: boolean; data?: any; error?: string }>;
      createTask: (taskData: any) => Promise<{ success: boolean; data?: any; error?: string }>;
      updateTask: (taskID: string, updates: any) => Promise<{ success: boolean; data?: any; error?: string }>;
      deleteTask: (taskID: string, userID: string) => Promise<{ success: boolean; error?: string }>;
      completeTask: (taskID: string, completionPercentage: number) => Promise<{ success: boolean; data?: any; error?: string }>;

      // Appointments
      getAppointments: (userID: string, filters?: any, pagination?: any) => Promise<{ success: boolean; data?: any; error?: string }>;
      createAppointment: (appointmentData: any) => Promise<{ success: boolean; data?: any; error?: string }>;
      updateAppointment: (appointmentID: string, updates: any) => Promise<{ success: boolean; data?: any; error?: string }>;
      deleteAppointment: (appointmentID: string, userID: string) => Promise<{ success: boolean; error?: string }>;
      checkAppointmentConflicts: (userID: string, startDateTime: string, endDateTime: string, excludeID?: string) => Promise<{ success: boolean; data?: any; error?: string }>;

      // Events
      getEvents: (userID: string, filters?: any, pagination?: any) => Promise<{ success: boolean; data?: any; error?: string }>;
      createEvent: (eventData: any) => Promise<{ success: boolean; data?: any; error?: string }>;
      updateEvent: (eventID: string, updates: any) => Promise<{ success: boolean; data?: any; error?: string }>;
      deleteEvent: (eventID: string, userID: string) => Promise<{ success: boolean; error?: string }>;

      // Meetings
      getMeetings: (userID: string, filters?: any, pagination?: any) => Promise<{ success: boolean; data?: any; error?: string }>;
      createMeeting: (meetingData: any) => Promise<{ success: boolean; data?: any; error?: string }>;
      updateMeeting: (meetingID: string, updates: any) => Promise<{ success: boolean; data?: any; error?: string }>;
      deleteMeeting: (meetingID: string, userID: string) => Promise<{ success: boolean; error?: string }>;
      joinMeeting: (meetingID: string, userID: string, email: string, name: string) => Promise<{ success: boolean; data?: any; error?: string }>;

      // Notes
      getNotes: (userID: string, filters?: any, pagination?: any) => Promise<{ success: boolean; data?: any; error?: string }>;
      createNote: (noteData: any) => Promise<{ success: boolean; data?: any; error?: string }>;
      updateNote: (noteID: string, updates: any) => Promise<{ success: boolean; data?: any; error?: string }>;
      deleteNote: (noteID: string, userID: string) => Promise<{ success: boolean; error?: string }>;

      // Calendar
      syncCalendar: (userID: string, source: string, startDate: string, endDate: string) => Promise<{ success: boolean; data?: any; error?: string }>;
      getCalendarEvents: (userID: string, startDate: string, endDate: string) => Promise<{ success: boolean; data?: any; error?: string }>;

      // Chat
      sendMessage: (conversationID: string, content: string) => Promise<{ success: boolean; data?: any; error?: string }>;
      getMessages: (conversationID: string, limit: number, before?: string) => Promise<{ success: boolean; data?: any; error?: string }>;
      observeMessages: (conversationID: string, callback: (message: any) => void) => Promise<() => void>;
      markMessagesRead: (conversationID: string) => Promise<{ success: boolean; error?: string }>;

      // Analytics
      generateReport: (userID: string, options: any) => Promise<{ success: boolean; data?: any; error?: string }>;
      getProductivityScore: (userID: string, date?: string) => Promise<{ success: boolean; data?: any; error?: string }>;
      getAnalyticsData: (userID: string, startDate: string, endDate: string) => Promise<{ success: boolean; data?: any; error?: string }>;

      // Settings
      getSettings: (userID: string) => Promise<{ success: boolean; data?: any; error?: string }>;
      updateSettings: (userID: string, updates: any) => Promise<{ success: boolean; data?: any; error?: string }>;

      // Sync
      syncPush: (userID: string) => Promise<{ success: boolean; error?: string }>;
      syncPull: (userID: string) => Promise<{ success: boolean; error?: string }>;
      syncStatus: (userID: string) => Promise<{ success: boolean; data?: any; error?: string }>;

      // Window
      minimizeWindow: () => void;
      maximizeWindow: () => void;
      closeWindow: () => void;

      // System
      getAppVersion: () => Promise<string>;
      getPlatform: () => string;
      openExternal: (url: string) => Promise<void>;
    };
  }
}