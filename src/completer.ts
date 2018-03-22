import { Promise, Thenable } from 'es6-promise';

type resolveFuncType<T> = (value?: T | Thenable<T>) => void;
type rejectFuncType = (error?: any) => void;
type ResolveAndReject<T> = {
    resolveFunc: resolveFuncType<T>,
    rejectFunc: rejectFuncType,
};

enum ResultType {
    REJECTED = "REJECTED",
    RESOLVED = "RESOLVED",
}

type Result<T> = {
    hasResult: boolean,
    type?: ResultType,
    resolvedWith?: T | Thenable<T>,
    reason?: any,
}

export interface Completer<T> {
    readonly promise: Promise<T>;
    resolve(value?: T | Thenable<T>): void;
    reject(reason?: any): void;
}

class ManualCompleter<T> implements Completer<T> {
    readonly promise: Promise<T>;
    private resolveAndReject: ResolveAndReject<T>;
    private result: Result<T> = {
        hasResult: false
    };


    constructor() {
        this.promise = new Promise<T>((resolve: resolveFuncType<T>, reject: rejectFuncType) => {
            this._catchResolveAndReject(resolve, reject);
        });
    }

    resolve(value?: T | Thenable<T>) {
        if (!this.result.hasResult) {
            this.result = {
                hasResult: true,
                type: ResultType.RESOLVED,
                resolvedWith: value,
            };
            this._checkIfCompleted();
        }
    }

    reject(reason?: any) {
        if (!this.result.hasResult) {
            this.result = {
                hasResult: true,
                type: ResultType.REJECTED,
                reason: reason,
            };
            this._checkIfCompleted();
        }
    }

    private _catchResolveAndReject(resolve: resolveFuncType<T>, reject: rejectFuncType) {
        this.resolveAndReject = {
            resolveFunc: resolve,
            rejectFunc: reject,
        }
        this._checkIfCompleted();
    }

    private _checkIfCompleted() {
        if (this.result.hasResult && this.resolveAndReject) {
            if (this.result.type === ResultType.RESOLVED) {
                this.resolveAndReject.resolveFunc(this.result.resolvedWith);
            } else if (this.result.type === ResultType.REJECTED) {
                this.resolveAndReject.rejectFunc(this.result.reason);
            }
        }
    }
}

class RejectingCompleter<T> implements Completer<T> {
    readonly promise: Promise<T>;

    constructor(timeoutMs: number, reason?: any) {
        if (timeoutMs < 0) {
            timeoutMs = 0;
        }
        if (reason === undefined) {
            reason = `promise timed out after ${timeoutMs}ms`;
        }
        this.promise = new Promise<T>((resolve: resolveFuncType<T>, reject: rejectFuncType) => {
            if (timeoutMs > 0) {
                setTimeout(() => reject(reason), timeoutMs);
            } else {
                reject(reason);
            }
        });
    }

    resolve(value?: T | Thenable<T>) { }
    reject(reason?: any) { }
}

class ResolvingCompleter<T> implements Completer<T> {
    readonly promise: Promise<T>;

    constructor(timeoutMs: number, value?: T | Thenable<T>) {
        this.promise = new Promise<T>((resolve: resolveFuncType<T>, reject: rejectFuncType) => {
            if (timeoutMs && timeoutMs > 0) {
                setTimeout(() => resolve(value), timeoutMs);
            } else {
                resolve(value);
            }
        });
    }

    resolve(value?: T | Thenable<T>) { }
    reject(reason?: any) { }
}

export class NewCompleter {

    static getManual<T>(): Completer<T> {
        return new ManualCompleter<T>();
    }

    static getManualOrTimedReject<T>(timeoutMs: number, reason?: any): Completer<T> {
        const completer = new ManualCompleter<T>();
        if (reason === undefined) {
            reason = `promise timed out after ${timeoutMs}ms`;
        }
        if (timeoutMs < 0) {
            timeoutMs = 0;
        }
        setTimeout(() => completer.reject(reason), timeoutMs);

        return completer;
    }

    static getManualOrTimedResolve<T>(timeoutMs: number, value?: T | Thenable<T>): Completer<T> {
        const completer = new ManualCompleter<T>();
        if (timeoutMs < 0) {
            timeoutMs = 0;
        }
        setTimeout(() => completer.resolve(value), timeoutMs);

        return completer;
    }

    static getTimedReject<T>(timeoutMs: number, reason?: any): Completer<T> {
        return new RejectingCompleter<T>(timeoutMs, reason);
    }

    static getTimedResolve<T>(timeoutMs: number, value?: T | Thenable<T>): Completer<T> {
        return new ResolvingCompleter<T>(timeoutMs, value);
    }

    static getRejected<T>(reason?: any): Completer<T> {
        return NewCompleter.getTimedReject<T>(0, reason);
    }

    static getResolved<T>(value?: T | Thenable<T>): Completer<T> {
        return NewCompleter.getTimedResolve<T>(0, value);
    }
}
