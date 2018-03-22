let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
let assert = chai.assert;
let { Completer, NewCompleter } = require("../dist/completer");

describe('NewCompleter', function () {
  describe('#getManual()', function () {

    it('should be able to resolve it\'s promise', function () {
      const value = "resolved with this string";
      let completer = NewCompleter.getManual();
      completer.resolve(value);
      completer.should.become(value);
    });
    
    it('should be able to reject it\'s promise', function () {
      const reason = "rejected with this string";
      let completer = NewCompleter.getManual();
      completer.reject(reason);
      completer.should.be.rejectedWith(reason);
    });
  });
});
