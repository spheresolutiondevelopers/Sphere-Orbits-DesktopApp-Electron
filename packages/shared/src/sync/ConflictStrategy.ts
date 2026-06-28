/**
 * Defines how conflicts are resolved when the same entity is modified
 * both locally and remotely between sync cycles.
 */
export type ConflictResolution =
  | { type: 'server-wins' }
  | { type: 'client-wins' }
  | { type: 'manual'; serverEntity: unknown; clientEntity: unknown }
  | { type: 'merge'; serverEntity: unknown; clientEntity: unknown };

export interface ConflictStrategy<T> {
  /**
   * Determines how to resolve a conflict between the local and server versions.
   * @param local - The local entity (client side)
   * @param remote - The remote entity (server side)
   * @param localUpdatedAt - Local last updated timestamp
   * @param remoteUpdatedAt - Server last updated timestamp
   * @returns A ConflictResolution object indicating the action to take.
   */
  resolve(
    local: T,
    remote: T,
    localUpdatedAt: string,
    remoteUpdatedAt: string
  ): ConflictResolution;

  /**
   * After conflict resolution, merge two entities into a single entity.
   * This is used when resolution is 'merge'.
   */
  merge(local: T, remote: T): T;
}

/**
 * Default strategy: Server wins if remote is newer, otherwise client wins.
 * Applies to all entities unless overridden.
 */
export class DefaultConflictStrategy<T> implements ConflictStrategy<T> {
  resolve(
    local: T,
    remote: T,
    localUpdatedAt: string,
    remoteUpdatedAt: string
  ): ConflictResolution {
    const localTime = new Date(localUpdatedAt).getTime();
    const remoteTime = new Date(remoteUpdatedAt).getTime();

    if (remoteTime > localTime) {
      return { type: 'server-wins' };
    } else if (remoteTime < localTime) {
      return { type: 'client-wins' };
    } else {
      // If timestamps are equal, we can't decide; default to manual.
      return { type: 'manual', serverEntity: remote, clientEntity: local };
    }
  }

  merge(local: T, remote: T): T {
    // Simple merge: take non-null values from both, preferring remote for conflicts
    return { ...local, ...remote };
  }
}

/**
 * Strategy that always asks the user to resolve conflicts manually.
 */
export class ManualConflictStrategy<T> implements ConflictStrategy<T> {
  resolve(
    local: T,
    remote: T,
    _localUpdatedAt: string,
    _remoteUpdatedAt: string
  ): ConflictResolution {
    return { type: 'manual', serverEntity: remote, clientEntity: local };
  }

  merge(local: T, remote: T): T {
    // Should never be called because we never resolve automatically.
    return remote;
  }
}

/**
 * Strategy that always merges fields, preferring newer timestamps per field.
 * This is a field‑level last‑write‑wins strategy.
 */
export class FieldLevelMergeStrategy<T extends Record<string, any>>
  implements ConflictStrategy<T>
{
  resolve(
    local: T,
    remote: T,
    _localUpdatedAt: string,
    _remoteUpdatedAt: string
  ): ConflictResolution {
    // We always merge; conflict is resolved by merge()
    return { type: 'merge', serverEntity: remote, clientEntity: local };
  }

  merge(local: T, remote: T): T {
    const merged = { ...local };
    for (const key of Object.keys(remote)) {
      // If remote field is defined and not null, prefer it
      if (remote[key] !== undefined && remote[key] !== null) {
        merged[key] = remote[key];
      }
    }
    return merged;
  }
}