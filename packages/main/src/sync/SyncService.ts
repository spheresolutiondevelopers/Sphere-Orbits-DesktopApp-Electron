import {
  TaskRepository,
  AppointmentRepository,
  EventRepository,
  MeetingRepository,
  NotesRepository,
  SettingsRepository,
  CalendarRepository,
  ChatRepository,
  AnalyticsRepository,
} from '@sphere/data';
import { ApiClient } from './ApiClient';
import { ConflictResolver } from './ConflictResolver';
import { SyncQueueManager } from './SyncQueueManager';
import { Result } from '@sphere/shared';

export class SyncService {
  private apiClient: ApiClient;
  private conflictResolver: ConflictResolver;
  private syncQueue: SyncQueueManager;
  private isRunning: boolean = false;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor(
    private taskRepo: TaskRepository,
    private appointmentRepo: AppointmentRepository,
    private eventRepo: EventRepository,
    private meetingRepo: MeetingRepository,
    private notesRepo: NotesRepository,
    private settingsRepo: SettingsRepository,
    private calendarRepo: CalendarRepository,
    private chatRepo: ChatRepository,
    private analyticsRepo: AnalyticsRepository,
    apiBaseURL: string
  ) {
    this.apiClient = new ApiClient(apiBaseURL);
    this.conflictResolver = new ConflictResolver();
    this.syncQueue = new SyncQueueManager();
  }

  setAuthToken(token: string): void {
    this.apiClient.setAuthToken(token);
    this.calendarRepo.setAuthToken(token);
  }

  async start(intervalMs: number = 30000): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    // Run initial sync
    await this.syncAll();
    // Schedule periodic sync
    this.syncInterval = setInterval(() => this.syncAll(), intervalMs);
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async syncAll(): Promise<void> {
    if (!this.isRunning) return;
    try {
      // Pull remote changes first
      await this.pull();
      // Push local changes
      await this.push();
    } catch (error) {
      console.error('Sync error:', error);
    }
  }

  async push(userID?: string): Promise<Result<void, Error>> {
    try {
      // Get all pending operations from the queue
      const operations = await this.syncQueue.getPendingOperations(userID);
      for (const op of operations) {
        await this.processOperation(op);
      }
      return Result.ok(undefined);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async pull(userID?: string): Promise<Result<void, Error>> {
    try {
      const targetUserID = userID || 'current';
      // Pull tasks
      const tasks = await this.apiClient.get('/tasks', { userID: targetUserID });
      // Pull appointments
      const appointments = await this.apiClient.get('/appointments', { userID: targetUserID });
      // Pull events
      const events = await this.apiClient.get('/events', { userID: targetUserID });
      // Pull meetings
      const meetings = await this.apiClient.get('/meetings', { userID: targetUserID });
      // Pull notes
      const notes = await this.apiClient.get('/notes', { userID: targetUserID });
      // Pull settings
      const settings = await this.apiClient.get('/settings', { userID: targetUserID });

      // Process each entity type with conflict resolution
      await this.processPullResults('tasks', tasks);
      await this.processPullResults('appointments', appointments);
      await this.processPullResults('events', events);
      await this.processPullResults('meetings', meetings);
      await this.processPullResults('notes', notes);
      await this.processPullResults('settings', settings);

      return Result.ok(undefined);
    } catch (error: any) {
      return Result.err(error);
    }
  }

  async getStatus(userID?: string): Promise<{ pending: number; lastSync: string | null }> {
    const pending = await this.syncQueue.getPendingCount(userID);
    return {
      pending,
      lastSync: new Date().toISOString(),
    };
  }

  private async processOperation(op: any): Promise<void> {
    try {
      // Send to server
      const response = await this.apiClient.post('/sync', op);
      if (response.conflict) {
        // Handle conflict
        await this.conflictResolver.resolve(op.entityType, op.entityID, response.serverEntity);
      } else {
        // Mark as synced
        await this.syncQueue.markComplete(op.id);
      }
    } catch (error) {
      await this.syncQueue.markFailed(op.id, (error as Error).message);
    }
  }

  private async processPullResults(entityType: string, data: any[]): Promise<void> {
    // For each entity, check if it exists locally and resolve conflicts
    for (const entity of data) {
      const localEntity = await this.getLocalEntity(entityType, entity.id);
      if (localEntity) {
        // Check for conflict
        if (new Date(entity.updatedAt) > new Date(localEntity.updatedAt)) {
          // Remote is newer - update local
          await this.updateLocalEntity(entityType, entity);
        }
      } else {
        // Entity doesn't exist locally - create it
        await this.createLocalEntity(entityType, entity);
      }
    }
  }

  private async getLocalEntity(entityType: string, id: string): Promise<any> {
    // Implementation would get from appropriate repository
    return null;
  }

  private async updateLocalEntity(entityType: string, entity: any): Promise<void> {
    // Implementation would update in appropriate repository
  }

  private async createLocalEntity(entityType: string, entity: any): Promise<void> {
    // Implementation would create in appropriate repository
  }
}