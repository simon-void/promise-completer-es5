let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();
let { Completer, NewCompleter } = require("../dist/completer");



describe('with Chai as promised it', function () {

  it('should be able to resolve a promise', function () {
    const value = "resolved with this string";
    let promise = new Promise((resolve, reject)=>{
      resolve(value);
    })
    return promise.should.become(value);
  });
  
  it('should be able to reject a promise', function () {
    const reason = "rejected with this string";
    let promise = new Promise((resolve, reject)=>{
      reject(reason);
    });
    promise.should.be.rejectedWith(reason);
  });
});

describe('NewCompleter', function () {
  describe('#getManual()', function () {

    it('should be able to resolve it\'s promise', function () {
      const value = "resolved with this string";
      let completer = NewCompleter.getManual();
      completer.resolve(value);
      completer.promise.should.become(value);
    });
    
    it('should be able to reject it\'s promise', function () {
      const reason = "rejected with this string";
      let completer = NewCompleter.getManual();
      completer.reject(reason);
      completer.promise.should.be.rejectedWith(reason);
    });
  });
});
