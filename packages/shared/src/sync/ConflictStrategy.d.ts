/**
 * Defines how conflicts are resolved when the same entity is modified
 * both locally and remotely between sync cycles.
 */
export type ConflictResolution = {
    type: 'server-wins';
} | {
    type: 'client-wins';
} | {
    type: 'manual';
    serverEntity: unknown;
    clientEntity: unknown;
} | {
    type: 'merge';
    serverEntity: unknown;
    clientEntity: unknown;
};
export interface ConflictStrategy<T> {
    /**
     * Determines how to resolve a conflict between the local and server versions.
     * @param local - The local entity (client side)
     * @param remote - The remote entity (server side)
     * @param localUpdatedAt - Local last updated timestamp
     * @param remoteUpdatedAt - Server last updated timestamp
     * @returns A ConflictResolution object indicating the action to take.
     */
    resolve(local: T, remote: T, localUpdatedAt: string, remoteUpdatedAt: string): ConflictResolution;
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
export declare class DefaultConflictStrategy<T> implements ConflictStrategy<T> {
    resolve(local: T, remote: T, localUpdatedAt: string, remoteUpdatedAt: string): ConflictResolution;
    merge(local: T, remote: T): T;
}
/**
 * Strategy that always asks the user to resolve conflicts manually.
 */
export declare class ManualConflictStrategy<T> implements ConflictStrategy<T> {
    resolve(_local: T, // <- renamed to _local
    remote: T, _localUpdatedAt: string, _remoteUpdatedAt: string): ConflictResolution;
    merge(_local: T, remote: T): T;
}
/**
 * Strategy that always merges fields, preferring newer timestamps per field.
 * This is a field‑level last‑write‑wins strategy.
 */
export declare class FieldLevelMergeStrategy<T extends Record<string, any>> implements ConflictStrategy<T> {
    resolve(local: T, remote: T, _localUpdatedAt: string, _remoteUpdatedAt: string): ConflictResolution;
    merge(local: T, remote: T): T;
}
//# sourceMappingURL=ConflictStrategy.d.ts.map