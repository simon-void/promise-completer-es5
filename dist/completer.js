"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var es6_promise_1 = require("es6-promise");
var ResultType;
(function (ResultType) {
    ResultType["REJECTED"] = "REJECTED";
    ResultType["RESOLVED"] = "RESOLVED";
})(ResultType || (ResultType = {}));
var ManualCompleter = /** @class */ (function () {
    function ManualCompleter() {
        var _this = this;
        this.result = {
            hasResult: false
        };
        this.promise = new es6_promise_1.Promise(function (resolve, reject) {
            _this._catchResolveAndReject(resolve, reject);
        });
    }
    ManualCompleter.prototype.resolve = function (value) {
        if (!this.result.hasResult) {
            this.result = {
                hasResult: true,
                type: ResultType.RESOLVED,
                resolvedWith: value,
            };
            this._checkIfCompleted();
        }
    };
    ManualCompleter.prototype.reject = function (reason) {
        if (!this.result.hasResult) {
            this.result = {
                hasResult: true,
                type: ResultType.REJECTED,
                reason: reason,
            };
            this._checkIfCompleted();
        }
    };
    ManualCompleter.prototype._catchResolveAndReject = function (resolve, reject) {
        this.resolveAndReject = {
            resolveFunc: resolve,
            rejectFunc: reject,
        };
        this._checkIfCompleted();
    };
    ManualCompleter.prototype._checkIfCompleted = function () {
        if (this.result.hasResult && this.resolveAndReject) {
            if (this.result.type === ResultType.RESOLVED) {
                this.resolveAndReject.resolveFunc(this.result.resolvedWith);
            }
            else if (this.result.type === ResultType.REJECTED) {
                this.resolveAndReject.rejectFunc(this.result.reason);
            }
        }
    };
    return ManualCompleter;
}());
var RejectingCompleter = /** @class */ (function () {
    function RejectingCompleter(timeoutMs, reason) {
        if (timeoutMs < 0) {
            timeoutMs = 0;
        }
        if (reason === undefined) {
            reason = "promise timed out after " + timeoutMs + "ms";
        }
        this.promise = new es6_promise_1.Promise(function (resolve, reject) {
            if (timeoutMs > 0) {
                setTimeout(function () { return reject(reason); }, timeoutMs);
            }
            else {
                reject(reason);
            }
        });
    }
    RejectingCompleter.prototype.resolve = function (value) { };
    RejectingCompleter.prototype.reject = function (reason) { };
    return RejectingCompleter;
}());
var ResolvingCompleter = /** @class */ (function () {
    function ResolvingCompleter(timeoutMs, value) {
        this.promise = new es6_promise_1.Promise(function (resolve, reject) {
            if (timeoutMs && timeoutMs > 0) {
                setTimeout(function () { return resolve(value); }, timeoutMs);
            }
            else {
                resolve(value);
            }
        });
    }
    ResolvingCompleter.prototype.resolve = function (value) { };
    ResolvingCompleter.prototype.reject = function (reason) { };
    return ResolvingCompleter;
}());
var NewCompleter = /** @class */ (function () {
    function NewCompleter() {
    }
    NewCompleter.getManual = function () {
        return new ManualCompleter();
    };
    NewCompleter.getManualOrTimedReject = function (timeoutMs, reason) {
        var completer = new ManualCompleter();
        if (reason === undefined) {
            reason = "promise timed out after " + timeoutMs + "ms";
        }
        if (timeoutMs < 0) {
            timeoutMs = 0;
        }
        setTimeout(function () { return completer.reject(reason); }, timeoutMs);
        return completer;
    };
    NewCompleter.getManualOrTimedResolve = function (timeoutMs, value) {
        var completer = new ManualCompleter();
        if (timeoutMs < 0) {
            timeoutMs = 0;
        }
        setTimeout(function () { return completer.resolve(value); }, timeoutMs);
        return completer;
    };
    NewCompleter.getTimedReject = function (timeoutMs, reason) {
        return new RejectingCompleter(timeoutMs, reason);
    };
    NewCompleter.getTimedResolve = function (timeoutMs, value) {
        return new ResolvingCompleter(timeoutMs, value);
    };
    NewCompleter.getRejected = function (reason) {
        return NewCompleter.getTimedReject(0, reason);
    };
    NewCompleter.getResolved = function (value) {
        return NewCompleter.getTimedResolve(0, value);
    };
    return NewCompleter;
}());
exports.NewCompleter = NewCompleter;
