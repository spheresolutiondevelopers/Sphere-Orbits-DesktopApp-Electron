"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSyncOperation = createSyncOperation;
/**
 * Factory to create a new sync operation.
 */
function createSyncOperation(entityType, operation, entityID, payload) {
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
//# sourceMappingURL=SyncOperation.js.map