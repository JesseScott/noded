(function(){
  'use strict';

  /* APP */

  var module = angular.module('app', ['onsen', 'service']);

  /* CONTROLLERS */

  module.controller('AppController', function($scope, ParseService) {
      $scope.hideTabs = true;
      $scope.currentUser = ParseService.getUser();
  });

  module.controller('SignupController', function($scope, ParseService) {

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

    var init = function() {
      if($scope.currentUser) {
        console.log("USER: " + $scope.currentUser.getUsername() );
        $scope.navigator.pushPage("master.html");
      }
      else {
        console.log("NO USER ");
      }
    };
    init();

    $scope.goToSignup = function() {
      $scope.navigator.pushPage('signup.html');
    }

    $scope.forgotPwd = function() {
      ons.notification.alert({message: 'this still needs to be coded!'});
    }

    $scope.login = function() {
      ParseService.login($scope.login_username, $scope.login_password, function(user) {
        console.log('logged in !!!');
        $scope.navigator.pushPage("master.html");
      });
    }

  });

  var MasterController = function($scope, $data, ParseService) {
        //$scope.hideTabs = false;

        ParseService.getNodes(function(results) {
          $scope.$apply(function() {
            $scope.items = results;
          });
        });

        $scope.showDetail = function(index) {
          var item = $scope.items[index];
          $data.selectedItem = item;
          $scope.navigator.pushPage('detail.html');
          // loadPage() ???
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
        ParseService.favouriteNode($scope.item, function(object) {
          ons.notification.alert({message: 'node added to faves!'});
        });
    };

    $scope.updateNode = function(update) {
        console.log('update');
        ParseService.updateNode($scope.item, update, function(object) {
          ons.notification.alert({message: 'node updated!'});
        });
    };

    $scope.navigateNode = function() {
        console.log('navigate');
        var lat = $scope.item.get('point').latitude;
        var lon = $scope.item.get('point').longitude;
        var title = $scope.item.get('owner');
        $data.latitude = lat;
        $data.longitude = lon;
        $data.title = title;
        $scope.navigator.pushPage('nav.html');
    };

    $scope.commentNode = function(comment) {
        console.log('comment');
        ParseService.commentNode($scope.item, comment, function(object) {
          ons.notification.alert({message: 'comment added to node!'});
        });
    };

  });

  module.controller('AddController', function($scope, $data, ParseService) {


    $scope.getLocation = function() {
      ons.notification.confirm({
        message: 'Would you like to enter a location manually, or use your current location?',
        buttonLabels: ['Cancel', 'Manual', 'GPS'],
        callback: function(idx) {
          switch(idx) {
            case 0:
              ons.notification.alert({
                message: 'You pressed "Cancel".'
              });
              break;
            case 1:
              modal.show();
              break;
            case 2:
              ons.notification.alert({
                message: 'You pressed "GPS".'
              });
              break;
          }
        }
      });
    }



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

  module.controller('MapController', function($scope, $data, $timeout, ParseService) {

    $scope.latitude  = $data.latitude;
    $scope.longitude = $data.longitude;
    $scope.title = $data.title;
    $scope.map;
    var bounds = new google.maps.LatLngBounds();

    //Map Init
    $timeout(function(){

       var latlng = new google.maps.LatLng($scope.latitude, $scope.longitude);
       var myOptions = {
           zoom: 18,
           center: latlng,
           mapTypeId: google.maps.MapTypeId.ROADMAP
       };

       $scope.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
       $scope.overlay = new google.maps.OverlayView();
       $scope.overlay.draw = function() {};
       $scope.overlay.setMap($scope.map);
       $scope.element = document.getElementById('map_canvas');

       var marker = new google.maps.Marker({
           position: latlng,
           map: $scope.map,
           title: $scope.title
       });
       bounds.extend(marker.position);

       $scope.getCurrentPosition();

    }, 100);

    $scope.getCurrentPosition = function() {
      console.log('getCurrentPosition');
      var options = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    };

    function onSuccess(position) {
      console.log('onSuccess');
      var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var marker = new google.maps.Marker({
          position: latlng,
          map: $scope.map,
          title: 'Your Location'
      });
      bounds.extend(marker.position);
      $scope.map.fitBounds(bounds);
    }

    function onError(error) {
      ons.notification.alert({message: error.message});
    }


  });


})();
