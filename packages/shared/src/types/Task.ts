export interface Task {
  taskID: string;
  userID: string;
  title: string;
  description?: string | null;
  taskType: 'general' | 'meeting' | 'reminder' | 'deadline' | 'event';
  priorityLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'deferred';
  completionPercentage: number; // 0-100
  dueDate?: string | null; // YYYY-MM-DD
  dueTime?: string | null; // HH:mm:ss
  startDate?: string | null;
  startTime?: string | null;
  endDate?: string | null;
  endTime?: string | null;
  locationName?: string | null;
  locationAddress?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  estimatedDurationMinutes?: number | null;
  actualDurationMinutes?: number | null;
  timeSpentMinutes: number;
  isRecurring: boolean;
  recurrenceRule?: string | null;
  parentTaskID?: string | null;
  externalID?: string | null;
  externalSource?: string | null;
  externalSyncStatus: 'not_synced' | 'synced' | 'failed';
  tags?: string | null;
  notes?: string | null;
  categoryID?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}