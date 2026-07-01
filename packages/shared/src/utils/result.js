"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Failure = exports.Success = void 0;
exports.ok = ok;
exports.err = err;
class Success {
    constructor(value) {
        this.value = value;
    }
    isSuccess() { return true; }
    isFailure() { return false; }
    getOrElse(_fallback) { return this.value; }
    getOrThrow() { return this.value; }
    map(fn) { return new Success(fn(this.value)); }
    flatMap(fn) { return fn(this.value); }
}
exports.Success = Success;
class Failure {
    constructor(error) {
        this.error = error;
    }
    isSuccess() { return false; }
    isFailure() { return true; }
    getOrElse(fallback) { return fallback; }
    getOrThrow() { throw this.error; }
    map(_fn) { return this; }
    flatMap(_fn) { return this; }
}
exports.Failure = Failure;
function ok(value) {
    return new Success(value);
}
function err(error) {
    return new Failure(error);
}
//# sourceMappingURL=result.js.map