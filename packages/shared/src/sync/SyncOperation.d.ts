/**
 * Represents a single operation to be synced with the server.
 * These are queued locally and processed in order.
 */
export type SyncOperationType = 'create' | 'update' | 'delete';
export interface SyncOperation<T = any> {
    id: string;
    entityType: 'task' | 'appointment' | 'event' | 'meeting' | 'note' | 'settings';
    operation: SyncOperationType;
    entityID: string;
    payload: T;
    localUpdatedAt: string;
    attempts: number;
    lastAttemptAt?: string;
    error?: string;
    status: 'pending' | 'in_progress' | 'success' | 'failed';
    createdAt: string;
    updatedAt: string;
}
/**
 * Factory to create a new sync operation.
 */
export declare function createSyncOperation<T>(entityType: SyncOperation['entityType'], operation: SyncOperationType, entityID: string, payload: T): Omit<SyncOperation<T>, 'id' | 'createdAt' | 'updatedAt'>;
//# sourceMappingURL=SyncOperation.d.ts.map