export type Result<T, E = Error> = Success<T, E> | Failure<T, E>;
export declare class Success<T, E> {
    readonly value: T;
    constructor(value: T);
    isSuccess(): this is Success<T, E>;
    isFailure(): this is Failure<T, E>;
    getOrElse(_fallback: T): T;
    getOrThrow(): T;
    map<U>(fn: (v: T) => U): Result<U, E>;
    flatMap<U>(fn: (v: T) => Result<U, E>): Result<U, E>;
}
export declare class Failure<T, E> {
    readonly error: E;
    constructor(error: E);
    isSuccess(): this is Success<T, E>;
    isFailure(): this is Failure<T, E>;
    getOrElse(fallback: T): T;
    getOrThrow(): never;
    map<U>(_fn: (v: T) => U): Result<U, E>;
    flatMap<U>(_fn: (v: T) => Result<U, E>): Result<U, E>;
}
export declare function ok<T, E = never>(value: T): Result<T, E>;
export declare function err<E>(error: E): Result<never, E>;
//# sourceMappingURL=result.d.ts.map