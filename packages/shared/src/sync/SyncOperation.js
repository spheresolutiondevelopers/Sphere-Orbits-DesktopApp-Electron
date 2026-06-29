/**
 * Factory to create a new sync operation.
 */
export function createSyncOperation(entityType, operation, entityID, payload) {
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
