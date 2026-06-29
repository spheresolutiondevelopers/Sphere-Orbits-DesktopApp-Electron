import { Result } from '@sphere/shared';

export interface Conflict {
  entityType: string;
  entityID: string;
  localEntity: any;
  remoteEntity: any;
  localUpdatedAt: string;
  remoteUpdatedAt: string;
}

export class ConflictResolver {
  /**
   * Resolves a conflict by comparing timestamps.
   * If remote is newer, remote wins.
   * If local is newer, local wins.
   * If equal, ask user (marked for manual resolution).
   */
  resolve(entityType: string, entityID: string, remoteEntity: any): Result<any, Error> {
    // In a real implementation, this would check the local entity
    // and determine the resolution strategy.
    // For now, we'll assume remote wins.
    return Result.ok(remoteEntity);
  }

  /**
   * Manual resolution – user picks which version to keep.
   */
  manualResolve(conflict: Conflict, keep: 'local' | 'remote'): any {
    return keep === 'local' ? conflict.localEntity : conflict.remoteEntity;
  }

  /**
   * Merges two entities field by field.
   */
  mergeFields(local: any, remote: any): any {
    const merged = { ...local };
    for (const key of Object.keys(remote)) {
      if (remote[key] !== undefined && remote[key] !== null) {
        merged[key] = remote[key];
      }
    }
    return merged;
  }
}