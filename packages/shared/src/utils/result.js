/**
 * A simple Result monad for error handling.
 * This pattern avoids throwing exceptions and makes errors explicit.
 */
export class Success {
    value;
    constructor(value) {
        this.value = value;
    }
    isSuccess() {
        return true;
    }
    isFailure() {
        return false;
    }
    getOrElse(fallback) {
        return this.value;
    }
    getOrThrow() {
        return this.value;
    }
    map(fn) {
        return new Success(fn(this.value));
    }
    flatMap(fn) {
        return fn(this.value);
    }
}
export class Failure {
    error;
    constructor(error) {
        this.error = error;
    }
    isSuccess() {
        return false;
    }
    isFailure() {
        return true;
    }
    getOrElse(fallback) {
        return fallback;
    }
    getOrThrow() {
        throw this.error;
    }
    map(_fn) {
        return this;
    }
    flatMap(_fn) {
        return this;
    }
}
export function ok(value) {
    return new Success(value);
}
export function err(error) {
    return new Failure(error);
}
/**
 * Utility to wrap a try/catch block into a Result.
 */
export function tryCatch(fn) {
    try {
        return ok(fn());
    }
    catch (e) {
        return err(e instanceof Error ? e : new Error(String(e)));
    }
}
/**
 * Async version of tryCatch.
 */
export async function tryCatchAsync(fn) {
    try {
        return ok(await fn());
    }
    catch (e) {
        return err(e instanceof Error ? e : new Error(String(e)));
    }
}
