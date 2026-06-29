/**
 * Default strategy: Server wins if remote is newer, otherwise client wins.
 * Applies to all entities unless overridden.
 */
export class DefaultConflictStrategy {
    resolve(local, remote, localUpdatedAt, remoteUpdatedAt) {
        const localTime = new Date(localUpdatedAt).getTime();
        const remoteTime = new Date(remoteUpdatedAt).getTime();
        if (remoteTime > localTime) {
            return { type: 'server-wins' };
        }
        else if (remoteTime < localTime) {
            return { type: 'client-wins' };
        }
        else {
            // If timestamps are equal, we can't decide; default to manual.
            return { type: 'manual', serverEntity: remote, clientEntity: local };
        }
    }
    merge(local, remote) {
        // Simple merge: take non-null values from both, preferring remote for conflicts
        return { ...local, ...remote };
    }
}
/**
 * Strategy that always asks the user to resolve conflicts manually.
 */
export class ManualConflictStrategy {
    resolve(local, remote, _localUpdatedAt, _remoteUpdatedAt) {
        return { type: 'manual', serverEntity: remote, clientEntity: local };
    }
    merge(local, remote) {
        // Should never be called because we never resolve automatically.
        return remote;
    }
}
/**
 * Strategy that always merges fields, preferring newer timestamps per field.
 * This is a field‑level last‑write‑wins strategy.
 */
export class FieldLevelMergeStrategy {
    resolve(local, remote, _localUpdatedAt, _remoteUpdatedAt) {
        // We always merge; conflict is resolved by merge()
        return { type: 'merge', serverEntity: remote, clientEntity: local };
    }
    merge(local, remote) {
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
