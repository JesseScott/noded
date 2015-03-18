(function(){
  'use strict';

  /* APP */

  var module = angular.module('app', ['onsen', 'service']);

  /* CONTROLLERS */

  module.controller('AppController', function($scope, $data) {
    $scope.doSomething = function() {
      setTimeout(function() {
        alert('tapped');
      }, 100);
    };
  });

  var MasterController = function($scope,  $data, ParseService) {

        // Fetch Nodes
          ParseService.getNodes(function(results) {
            $scope.$apply(function() {
              $scope.items = results;
            });
          });

        $scope.showDetail = function(index) {
          var item = $scope.items[index];
          $data.selectedItem = item;
          $scope.navigator.pushPage('detail.html', {title : item.get('ssid')});
        };

  }
  MasterController.$inject = ['$scope', '$data', 'ParseService'];
  module.controller('MasterController', MasterController);

  module.controller('DetailController', function($scope, $data) {
    $scope.item = $data.selectedItem;
  });

  /* FACTORIES */

  module.factory('$data', function() {
      var data = {};
      return data;
  });



})();
