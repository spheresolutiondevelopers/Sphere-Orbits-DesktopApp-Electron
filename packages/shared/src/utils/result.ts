/**
 * A simple Result monad for error handling.
 * This pattern avoids throwing exceptions and makes errors explicit.
 */

export type Result<T, E = Error> = Success<T> | Failure<E>;

export class Success<T> {
  readonly value: T;
  constructor(value: T) {
    this.value = value;
  }
  isSuccess(): this is Success<T> {
    return true;
  }
  isFailure(): this is Failure<any> {
    return false;
  }
  getOrElse(fallback: T): T {
    return this.value;
  }
  getOrThrow(): T {
    return this.value;
  }
  map<U>(fn: (v: T) => U): Result<U, E> {
    return new Success(fn(this.value));
  }
  flatMap<U>(fn: (v: T) => Result<U, E>): Result<U, E> {
    return fn(this.value);
  }
}

export class Failure<E> {
  readonly error: E;
  constructor(error: E) {
    this.error = error;
  }
  isSuccess(): this is Success<any> {
    return false;
  }
  isFailure(): this is Failure<E> {
    return true;
  }
  getOrElse<T>(fallback: T): T {
    return fallback;
  }
  getOrThrow(): never {
    throw this.error;
  }
  map<U>(_fn: (v: any) => U): Result<U, E> {
    return this as any;
  }
  flatMap<U>(_fn: (v: any) => Result<U, E>): Result<U, E> {
    return this as any;
  }
}

export function ok<T>(value: T): Result<T, never> {
  return new Success(value);
}

export function err<E>(error: E): Result<never, E> {
  return new Failure(error);
}

/**
 * Utility to wrap a try/catch block into a Result.
 */
export function tryCatch<T>(fn: () => T): Result<T, Error> {
  try {
    return ok(fn());
  } catch (e) {
    return err(e instanceof Error ? e : new Error(String(e)));
  }
}

/**
 * Async version of tryCatch.
 */
export async function tryCatchAsync<T>(
  fn: () => Promise<T>
): Promise<Result<T, Error>> {
  try {
    return ok(await fn());
  } catch (e) {
    return err(e instanceof Error ? e : new Error(String(e)));
  }
}