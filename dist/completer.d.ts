import { Promise } from 'es6-promise';
declare class Completer<T> {
    readonly promise: Promise<T>;
    private resolveAndReject;
    private result;
    constructor(timeoutMs?: number);
    rosolve(value: T): void;
    reject(reason?: any): void;
    private catchResolveAndReject(resolve, reject);
    private checkIfCompleted();
}
export default Completer;
