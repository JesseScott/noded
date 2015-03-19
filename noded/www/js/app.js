(function(){
  'use strict';

  /* APP */

  var module = angular.module('app', ['onsen', 'service']);

  /* CONTROLLERS */

  module.controller('AppController', function($scope) {

  });

  var MasterController = function($scope, $data, ParseService) {
        // ParseService.getNodes(function(results) {
        //   $scope.$apply(function() {
        //     $scope.items = results;
        //   });
        // });

        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady(){
          alert("PhoneGap is ready.");
        }

        // geolocation.getCurrentPosition(function (position) {
        //   alert('Latitude: '              + position.coords.latitude          + '\n' +
        //         'Longitude: '             + position.coords.longitude         + '\n' +
        //         'Altitude: '              + position.coords.altitude          + '\n' +
        //         'Timestamp: '             + position.timestamp                + '\n'
        //         );
        // });

        $scope.showDetail = function(index) {
          var item = $scope.items[index];
          $data.selectedItem = item;
          $scope.navigator.pushPage('detail.html', {title : item.get('ssid')});
        };
  }
  MasterController.$inject = ['$scope', '$data', 'ParseService'];
  module.controller('MasterController', MasterController);

  module.controller('DetailController', function($scope, $data, ParseService) {
    $scope.item = $data.selectedItem;

    $scope.addNote = function(note) {
        var obj = $scope.item;
        ParseService.addNote(obj, note, function() {
          //
        });
    };
  });

  /* FACTORIES */

  module.factory('$data', function() {
      var data = {};
      return data;
  });


  module.factory('geolocation', function ($rootScope, cordovaReady) {
    return {
        getCurrentPosition: cordovaReady(function (onSuccess, onError, options) {
          navigator.geolocation.getCurrentPosition(function () {
            var that = this,
              args = arguments;

            if (onSuccess) {
              $rootScope.$apply(function () {
                onSuccess.apply(that, args);
              });
            }
          }, function () {
            var that = this,
              args = arguments;

            if (onError) {
              $rootScope.$apply(function () {
                onError.apply(that, args);
              });
            }
          },
          options);
        })
      };
  });

  module.factory('cordovaReady', function() {
    return function (fn) {
      var queue = [];
      var impl = function () {
        queue.push(Array.prototype.slice.call(arguments));
      };
      document.addEventListener('deviceready', function () {
        queue.forEach(function (args) {
          fn.apply(this, args);
        });
        impl = fn;
      }, false);
      return function () {
        return impl.apply(this, arguments);
      };
    };
  });




})();
