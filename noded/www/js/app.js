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
/*
  module.controller('MasterController', function($scope, $data, ParseService) {

    // On startup...
    $scope.nodeList = [];
    //$scope.init();

    // Fetch Nodes
    $scope.getNodes = function() {
      ParseService.getNodes(function(results) {
        $scope.$apply(function() {
          $scope.nodeList = results;
          console.log("HERE");
        });
      });
    }

    $scope.items = $data.items;

    $scope.showDetail = function(index) {
      var selectedItem = $data.items[index];
      $data.selectedItem = selectedItem;
      $scope.navigator.pushPage('detail.html', {title : selectedItem.title});
    };

  });
*/
  var MasterController = function($scope,  $data, ParseService) {
        // On startup...
        $scope.nodeList = [];
        //$scope.init();

        // Fetch Nodes
          ParseService.getNodes(function(results) {
            $scope.$apply(function() {
              $scope.items = results;
            });
          });

        /*
        $scope.items = $data.items;

        $scope.showDetail = function(index) {
          var selectedItem = $data.items[index];
          $data.selectedItem = selectedItem;
          $scope.navigator.pushPage('detail.html', {title : selectedItem.title});
        };
        */
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
/*
  module.factory('ParseService', function($resource) {

      // Init
      Parse.initialize("BiYJKFD8IxfkHxzoTxfW4nYE3im1Jvhc6Jy2v7j8", "AtXojjwtcnc4a6WkxJZcTrq7smHEe4iRI2EKYVIw");

      // Define parse model and collection for Book records
      var Node = Parse.Object.extend("Node");

      var ParseService = {
        name: "Parse",

        // Get All Nodes
        getNodes : function getNodes(callback) {
          var query = new Parse.Query(Node);

          query.find({
            success : function(results) {
              callback(results);
            },
            error : function(error) {
              alert("Error" + error.message);
            }
          });
        },

        // Create A New Node
        addNode : function addNode(_ssid, _password, _owner, _location, _mac, _image, callback) {
          var object = new Node();
          object.save({ssid:_ssid, password:_password, owner:_owner, point:_location, mac:_mac, thumbnail:_image}, {
            success: function(object) {
              callback();
            },
            error: function(error) {
              alert("Error: " + error.message);
            }
          });
        },

      };

      // The factory function returns ParseService, which is injected into controllers.
      return ParseService;
  });
*/


})();
