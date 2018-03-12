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
    resolvedWith?: T,
    reason?: any,
}

class Completer<T> {
    readonly promise: Promise<T>;
    private resolveAndReject: ResolveAndReject<T>;
    private result: Result<T> = {
        hasResult: false
    };


    constructor(timeoutMs?: number) {
        this.promise = new Promise<T>((resolve: resolveFuncType<T>, reject: rejectFuncType) => {
            this.catchResolveAndReject(resolve, reject);
        });
        if (timeoutMs && timeoutMs > 0) {
            setTimeout(() => this.reject(`promise timed out after ${timeoutMs}ms`), timeoutMs);
        }
    }

    rosolve(value: T) {
        if (!this.result.hasResult) {
            this.result = {
                hasResult: true,
                type: ResultType.RESOLVED,
                resolvedWith: value,
            };
            this.checkIfCompleted();
        }
    }

    reject(reason?: any) {
        if (!this.result.hasResult) {
            this.result = {
                hasResult: true,
                type: ResultType.REJECTED,
                reason: reason,
            };
            this.checkIfCompleted();
        }
    }

    private catchResolveAndReject(resolve: resolveFuncType<T>, reject: rejectFuncType) {
        this.resolveAndReject = {
            resolveFunc: resolve,
            rejectFunc: reject,
        }
        this.checkIfCompleted();
    }

    private checkIfCompleted() {
        if (this.result.hasResult && this.resolveAndReject) {
            if (this.result.type === ResultType.RESOLVED) {
                this.resolveAndReject.resolveFunc(this.result.resolvedWith);
            } else if (this.result.type === ResultType.REJECTED) {
                this.resolveAndReject.rejectFunc(this.result.reason);
            }
        }
    }
}

export default Completer;