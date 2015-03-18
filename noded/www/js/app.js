(function(){
  'use strict';

  /* APP */

  var module = angular.module('app', ['onsen','ngResource', 'appServices']);

  /* CONTROLLERS */

  module.controller('AppController', function($scope, $data) {
    $scope.doSomething = function() {
      setTimeout(function() {
        alert('tapped');
      }, 100);
    };
  });

  module.controller('DetailController', function($scope, $data) {
    $scope.item = $data.selectedItem;
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


  /* FACTORIES */

  module.factory('$data', function() {
      var data = {};

      data.items = [
          {
              title: 'Item 1 Title',
              label: '4h',
              desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
          },
          {
              title: 'Another Item Title',
              label: '6h',
              desc: 'Ut enim ad minim veniam.'
          },
          {
              title: 'Yet Another Item Title',
              label: '1day ago',
              desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
          },
          {
              title: 'Yet Another Item Title',
              label: '1day ago',
              desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
          }
      ];

      return data;
  });



})();
