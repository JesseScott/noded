(function(){
  'use strict';

  /* APP */

  var module = angular.module('app', ['onsen', 'service']);

  /* CONTROLLERS */

  module.controller('AppController', function($scope) {
      $scope.hideTabs = true;
  });

  module.controller('SignupController', function($scope, ParseService) {

      var user = ParseService.getUser();
      if(user) {
        console.log( user.getUsername() );
      }

      $scope.goToLogin = function() {
        $scope.navigator.popPage();
      }

      $scope.signup = function() {
        ParseService.signUp($scope.signup_username, $scope.signup_password, $scope.signup_email, function(user) {
          console.log('signed up !!!');
          $scope.navigator.pushPage("master.html");
        });
      }

  });

  module.controller('LoginController', function($scope, ParseService) {

    $scope.goToSignup = function() {
      $scope.navigator.pushPage('signup.html');
    }

    $scope.forgotPwd = function() {
      alert('this still needs to be coded');
    }

    $scope.login = function() {
      ParseService.login($scope.login_username, $scope.login_password, function(user) {
        console.log('logged in !!!');
        $scope.navigator.pushPage("master.html");
      });
    }

  });

  var MasterController = function($scope, $data, ParseService) {
        $scope.hideTabs = false;
        ParseService.getNodes(function(results) {
          $scope.$apply(function() {
            $scope.items = results;
          });
        });

        // document.addEventListener("deviceready", onDeviceReady, false);
        // function onDeviceReady(){
        //   alert("PhoneGap is ready.");
        // }

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
          $scope.navigator.pushPage('detail.html');
        };

        $scope.goToAdd = function() {
          console.log('to add!');
          $scope.navigator.pushPage('add.html');
        }

  }
  MasterController.$inject = ['$scope', '$data', 'ParseService'];
  module.controller('MasterController', MasterController);

  module.controller('DetailController', function($scope, $data, ParseService) {
    $scope.item = $data.selectedItem;

    $scope.favouriteNode = function() {
        console.log('fave');
        ParseService.favouriteNode($scope.item, function() {
          //
        });
    };

    $scope.updateNode = function(update) {
        console.log('update');
        ParseService.updateNode($scope.item, update, function() {
          //
        });
    };

    $scope.commentNode = function(comment) {
        console.log('comment');
        ParseService.commentNode($scope.item, comment, function() {
          //
        });
    };

  });

  module.controller('AddController', function($scope, $data, ParseService) {

    $scope.addNode = function() {
        ParseService.addNode(
          $scope.add_network, $scope.add_password, $scope.add_business,
          $scope.add_security, $scope.add_notes, ParseService.getUser(),
          $scope.add_location, $scope.add_photo, function(object) {
            alert('successfully added');
            $scope.navigator.popPage();
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
