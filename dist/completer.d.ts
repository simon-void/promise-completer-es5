import { Promise, Thenable } from 'es6-promise';
export interface Completer<T> {
    readonly promise: Promise<T>;
    resolve(value?: T | Thenable<T>): void;
    reject(reason?: any): void;
}
export declare class NewCompleter {
    static getManual<T>(): Completer<T>;
    static getManualOrTimedReject<T>(timeoutMs: number, reason?: any): Completer<T>;
    static getManualOrTimedResolve<T>(timeoutMs: number, value?: T | Thenable<T>): Completer<T>;
    static getTimedReject<T>(timeoutMs: number, reason?: any): Completer<T>;
    static getTimedResolve<T>(timeoutMs: number, value?: T | Thenable<T>): Completer<T>;
    static getRejected<T>(reason?: any): Completer<T>;
    static getResolved<T>(value?: T | Thenable<T>): Completer<T>;
}
