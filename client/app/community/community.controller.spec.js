'use strict';

describe('Controller: CommunityCtrl', function () {

  // load the controller's module
  beforeEach(module('healthsocialDevApp'));

  var CommunityCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CommunityCtrl = $controller('CommunityCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
