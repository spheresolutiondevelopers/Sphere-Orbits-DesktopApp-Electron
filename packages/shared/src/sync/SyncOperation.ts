/**
 * Represents a single operation to be synced with the server.
 * These are queued locally and processed in order.
 */
export type SyncOperationType = 'create' | 'update' | 'delete';

export interface SyncOperation<T = any> {
  id: string; // UUID for this operation
  entityType: 'task' | 'appointment' | 'event' | 'meeting' | 'note' | 'settings';
  operation: SyncOperationType;
  entityID: string; // ID of the entity being synced
  payload: T; // The full entity data (for create/update) or null (for delete)
  localUpdatedAt: string; // Timestamp of the local change
  attempts: number; // Number of times this operation has been attempted
  lastAttemptAt?: string; // Timestamp of last attempt
  error?: string; // Last error message if failed
  status: 'pending' | 'in_progress' | 'success' | 'failed';
  createdAt: string;
  updatedAt: string;
}

/**
 * Factory to create a new sync operation.
 */
export function createSyncOperation<T>(
  entityType: SyncOperation['entityType'],
  operation: SyncOperationType,
  entityID: string,
  payload: T
): Omit<SyncOperation<T>, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    entityType,
    operation,
    entityID,
    payload,
    localUpdatedAt: new Date().toISOString(),
    attempts: 0,
    status: 'pending',
  };
}