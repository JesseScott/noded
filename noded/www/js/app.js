(function(){
  'use strict';

  /* APP */

  var module = angular.module('app', ['onsen', 'service']);

  /* CONTROLLERS */

  module.controller('AppController', function($scope) {

  });

  var MasterController = function($scope, $data, ParseService) {
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

    $scope.addNote = function(note) {
        console.log(note);
    };
  });

  /* FACTORIES */

  module.factory('$data', function() {
      var data = {};
      return data;
  });



})();
