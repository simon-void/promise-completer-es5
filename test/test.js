let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();
let { Completer, NewCompleter } = require("../dist/completer");



const VALUE = "resolution";
const DEFAULT_VALUE = "default resolution";
const REASON = "rejection";
const DEFAULT_REASON = "default rejection";
const TIMEOUT_MS = 200;
const MORE_THAN_TIMEOUT_MS = TIMEOUT_MS * 1.1;
const LESS_THAN_TIMEOUT_MS = TIMEOUT_MS * 0.9;

// describe('Chai as promised', function () {
//   describe('#should', function () {

//     it('should be able to resolve a promise', function () {
//       let promise = Promise.resolve(VALUE);
//       return promise.should.become(VALUE);
//     });

//     it('should be able to reject a promise', function () {
//       let promise = Promise.reject(REASON);
//       promise.should.be.rejectedWith(REASON);
//     });
//   });
// });

function assertNotCompletedwithin(promise, done, timeout) {
  let isDone = false;
  function invokeDoneOnce(err) {
    if(!isDone) {
      done(err);
      isDone = true;
    }
  }

  promise.then(
    function (result) {
      invokeDoneOnce("unexpected resolve with value: " + result);
    },
    function (err) {
      invokeDoneOnce("unexpected reject with reason: " + err);
    }
  );
  setTimeout(invokeDoneOnce, timeout);
}


describe('NewCompleter', function () {
  describe('#getManual()', function () {

    it('should be able to resolve it\'s promise', function () {
      let completer = NewCompleter.getManual();
      completer.resolve(VALUE);
      completer.promise.should.become(VALUE);
    });

    it('should be able to reject it\'s promise', function () {
      let completer = NewCompleter.getManual();
      completer.reject(REASON);
      completer.promise.should.be.rejectedWith(REASON);
    });

    it('should neither be resolved or rejected on its own', function (done) {
      let completer = NewCompleter.getManual();
      assertNotCompletedwithin(completer.promise, done, MORE_THAN_TIMEOUT_MS);
    });
  });

  describe('#getManualOrTimedReject()', function () {

    it('should be able to resolve it\'s promise', function () {
      let completer = NewCompleter.getManualOrTimedReject(TIMEOUT_MS, DEFAULT_REASON);
      completer.resolve(VALUE);
      completer.promise.should.become(VALUE);
    });

    it('should be able to reject it\'s promise', function () {
      let completer = NewCompleter.getManualOrTimedReject(TIMEOUT_MS, DEFAULT_REASON);
      completer.reject(REASON);
      completer.promise.should.be.rejectedWith(REASON);
    });

    it('should automatically reject it\'s promise after timeout', function () {
      let completer = NewCompleter.getManualOrTimedReject(TIMEOUT_MS, DEFAULT_REASON);
      completer.promise.should.be.rejectedWith(DEFAULT_REASON);
    });

    it('shouldn\'t complete on its own before timeout', function (done) {
      let completer = NewCompleter.getManualOrTimedReject(TIMEOUT_MS, DEFAULT_REASON);
      assertNotCompletedwithin(completer.promise, done, LESS_THAN_TIMEOUT_MS);
    });
  });

  describe('#getManualOrTimedResolve()', function () {

    it('should be able to resolve it\'s promise', function () {
      let completer = NewCompleter.getManualOrTimedResolve(TIMEOUT_MS, DEFAULT_VALUE);
      completer.resolve(VALUE);
      completer.promise.should.become(VALUE);
    });

    it('should be able to reject it\'s promise', function () {
      let completer = NewCompleter.getManualOrTimedResolve(TIMEOUT_MS, DEFAULT_VALUE);
      completer.reject(REASON);
      completer.promise.should.be.rejectedWith(REASON);
    });

    it('should automatically resolve it\'s promise after timeout', function () {
      let completer = NewCompleter.getManualOrTimedResolve(TIMEOUT_MS, DEFAULT_VALUE);
      completer.promise.should.become(DEFAULT_VALUE);
    });

    it('shouldn\'t complete on its own before timeout', function (done) {
      let completer = NewCompleter.getManualOrTimedResolve(TIMEOUT_MS, DEFAULT_VALUE);
      assertNotCompletedwithin(completer.promise, done, LESS_THAN_TIMEOUT_MS);
    });
  });

  describe('#getTimedReject()', function () {

    it('should reject with default reason after timeout even if resolved manually', function () {
      let completer = NewCompleter.getTimedReject(TIMEOUT_MS, DEFAULT_REASON);
      completer.resolve(VALUE);
      completer.promise.should.be.rejectedWith(DEFAULT_REASON);
    });

    it('should reject with default reason after timeout even if rejected manually', function () {
      let completer = NewCompleter.getTimedReject(TIMEOUT_MS, DEFAULT_REASON);
      completer.reject(REASON);
      completer.promise.should.be.rejectedWith(DEFAULT_REASON);
    });

    it('should reject with default reason after timeout even if not resolved or rejected manually', function () {
      let completer = NewCompleter.getTimedReject(TIMEOUT_MS, DEFAULT_REASON);
      completer.promise.should.be.rejectedWith(DEFAULT_REASON);
    });

    it('shouldn\'t complete on its own before timeout', function (done) {
      let completer = NewCompleter.getTimedReject(TIMEOUT_MS, DEFAULT_REASON);
      assertNotCompletedwithin(completer.promise, done, LESS_THAN_TIMEOUT_MS);
    });
  });

  describe('#getTimedResolve()', function () {

    it('should resolve with default value after timeout even if not resolved manually', function () {
      let completer = NewCompleter.getTimedResolve(TIMEOUT_MS, DEFAULT_VALUE);
      completer.resolve(VALUE);
      completer.promise.should.become(DEFAULT_VALUE);
    });

    it('should resolve with default value after timeout even if rejected manually', function () {
      let completer = NewCompleter.getTimedResolve(TIMEOUT_MS, DEFAULT_VALUE);
      completer.reject(REASON);
      completer.promise.should.become(DEFAULT_VALUE);
    });

    it('should resolve with default value after timeout even if not resolved or rejected manually', function () {
      let completer = NewCompleter.getTimedResolve(TIMEOUT_MS, DEFAULT_VALUE);
      completer.promise.should.become(DEFAULT_VALUE);
    });

    it('shouldn\'t complete on its own before timeout', function (done) {
      let completer = NewCompleter.getTimedResolve(TIMEOUT_MS, DEFAULT_VALUE);
      assertNotCompletedwithin(completer.promise, done, LESS_THAN_TIMEOUT_MS);
    });
  });

  describe('#getRejected()', function () {

    it('should reject with default reason even if resolved manually', function () {
      let completer = NewCompleter.getRejected(DEFAULT_REASON);
      completer.resolve(VALUE);
      completer.promise.should.be.rejectedWith(DEFAULT_REASON);
    });

    it('should reject with default reason even if rejected manually', function () {
      let completer = NewCompleter.getRejected(DEFAULT_REASON);
      completer.reject(REASON);
      completer.promise.should.be.rejectedWith(DEFAULT_REASON);
    });

    it('should reject with default reason even if not resolved or rejected manually', function () {
      let completer = NewCompleter.getRejected(DEFAULT_REASON);
      completer.promise.should.be.rejectedWith(DEFAULT_REASON);
    });
  });

  describe('#getResolved()', function () {

    it('should resolve with default value even if resolved manually', function () {
      let completer = NewCompleter.getResolved(DEFAULT_VALUE);
      completer.resolve(VALUE);
      completer.promise.should.become(DEFAULT_VALUE);
    });

    it('should resolve with default value even if rejected manually', function () {
      let completer = NewCompleter.getResolved(DEFAULT_VALUE);
      completer.reject(REASON);
      completer.promise.should.become(DEFAULT_VALUE);
    });

    it('should resolve with default value even if not resolved or rejected manually', function () {
      let completer = NewCompleter.getResolved(DEFAULT_VALUE);
      completer.promise.should.become(DEFAULT_VALUE);
    });
  });
});
