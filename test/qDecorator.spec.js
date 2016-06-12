'use strict';

describe('$q Decorator', function() {
  var $q;
  var $rootScope;
  var deferred;
  var originalTimeout;
  
  beforeEach(module('ng-q-timeout-decorator'));
  
  beforeEach(inject(function(_$q_, _$rootScope_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    deferred = _$q_.defer();
  }));
  
  beforeEach(function() {
    jasmine.clock().install();
  });
  
  afterEach(function() {
    jasmine.clock().uninstall();
  });
  
  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
  });
  
  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  
  it('should have $q defined', function() {
    expect($q).toBeDefined();
  });
  
  it('should resolve promise', function() {
    var response;
    
    deferred.promise.then(function(data) {
      response = data;
    });
    
    deferred.resolve('Resolved');
    
    $rootScope.$apply();
    
    expect(response).toBe('Resolved');
  });
  
  it('should reject promise due to timeout', function() {
//    var response;
//    
//    deferred
//      .promise
//      .then(function(data) {
//      console.log('resolved')
//        response = data;
//      })
//      .catch(function(data) {
//      console.log('rejected')
//        response = data;
//      });
//    
//    jasmine.clock().tick(1010);
//    
//    
//    setTimeout(function() {
//      response = 
////      timerCallback();
//    }, 1000);
    
//    expect(timerCallback).not.toHaveBeenCalled();
    
//    jasmine.clock().tick(2000);
    
//    expect(timerCallback).toHaveBeenCalled();
    
//    expect(response).toBe('Promise timeout exceed!');
    
    
  });
});