export type Result<T, E = Error> = Success<T, E> | Failure<T, E>;

export class Success<T, E> {
  constructor(public readonly value: T) {}
  isSuccess(): this is Success<T, E> { return true; }
  isFailure(): this is Failure<T, E> { return false; }
  getOrElse(_fallback: T): T { return this.value; }
  getOrThrow(): T { return this.value; }
  map<U>(fn: (v: T) => U): Result<U, E> { return new Success(fn(this.value)); }
  flatMap<U>(fn: (v: T) => Result<U, E>): Result<U, E> { return fn(this.value); }
}

export class Failure<T, E> {
  constructor(public readonly error: E) {}
  isSuccess(): this is Success<T, E> { return false; }
  isFailure(): this is Failure<T, E> { return true; }
  getOrElse(fallback: T): T { return fallback; }
  getOrThrow(): never { throw this.error; }
  map<U>(_fn: (v: T) => U): Result<U, E> { return this as any; }
  flatMap<U>(_fn: (v: T) => Result<U, E>): Result<U, E> { return this as any; }
}

export function ok<T, E = never>(value: T): Result<T, E> {
  return new Success(value);
}
export function err<E>(error: E): Result<never, E> {
  return new Failure(error);
}