"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldLevelMergeStrategy = exports.ManualConflictStrategy = exports.DefaultConflictStrategy = void 0;
/**
 * Default strategy: Server wins if remote is newer, otherwise client wins.
 * Applies to all entities unless overridden.
 */
class DefaultConflictStrategy {
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
exports.DefaultConflictStrategy = DefaultConflictStrategy;
/**
 * Strategy that always asks the user to resolve conflicts manually.
 */
class ManualConflictStrategy {
    resolve(_local, // <- renamed to _local
    remote, _localUpdatedAt, _remoteUpdatedAt) {
        return { type: 'manual', serverEntity: remote, clientEntity: _local };
    }
    merge(_local, remote) {
        // Should never be called because we never resolve automatically.
        return remote;
    }
}
exports.ManualConflictStrategy = ManualConflictStrategy;
/**
 * Strategy that always merges fields, preferring newer timestamps per field.
 * This is a field‑level last‑write‑wins strategy.
 */
class FieldLevelMergeStrategy {
    resolve(local, remote, _localUpdatedAt, _remoteUpdatedAt) {
        return { type: 'merge', serverEntity: remote, clientEntity: local };
    }
    merge(local, remote) {
        const merged = { ...local };
        for (const key of Object.keys(remote)) {
            if (remote[key] !== undefined && remote[key] !== null) {
                merged[key] = remote[key];
            }
        }
        return merged;
    }
}
exports.FieldLevelMergeStrategy = FieldLevelMergeStrategy;
//# sourceMappingURL=ConflictStrategy.js.map