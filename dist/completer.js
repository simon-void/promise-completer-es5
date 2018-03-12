import { Promise } from 'es6-promise';
var ResultType;
(function (ResultType) {
    ResultType["REJECTED"] = "REJECTED";
    ResultType["RESOLVED"] = "RESOLVED";
})(ResultType || (ResultType = {}));
var Completer = /** @class */ (function () {
    function Completer(timeoutMs) {
        var _this = this;
        this.result = {
            hasResult: false
        };
        this.promise = new Promise(function (resolve, reject) {
            _this.catchResolveAndReject(resolve, reject);
        });
        if (timeoutMs && timeoutMs > 0) {
            setTimeout(function () { return _this.reject("promise timed out after " + timeoutMs + "ms"); }, timeoutMs);
        }
    }
    Completer.prototype.rosolve = function (value) {
        if (!this.result.hasResult) {
            this.result = {
                hasResult: true,
                type: ResultType.RESOLVED,
                resolvedWith: value,
            };
            this.checkIfCompleted();
        }
    };
    Completer.prototype.reject = function (reason) {
        if (!this.result.hasResult) {
            this.result = {
                hasResult: true,
                type: ResultType.REJECTED,
                reason: reason,
            };
            this.checkIfCompleted();
        }
    };
    Completer.prototype.catchResolveAndReject = function (resolve, reject) {
        this.resolveAndReject = {
            resolveFunc: resolve,
            rejectFunc: reject,
        };
        this.checkIfCompleted();
    };
    Completer.prototype.checkIfCompleted = function () {
        if (this.result.hasResult && this.resolveAndReject) {
            if (this.result.type === ResultType.RESOLVED) {
                this.resolveAndReject.resolveFunc(this.result.resolvedWith);
            }
            else if (this.result.type === ResultType.REJECTED) {
                this.resolveAndReject.rejectFunc(this.result.reason);
            }
        }
    };
    return Completer;
}());
export default Completer;
