'use strict';

/* Services */

//var app = angular.module('app', []);
//var module = angular.module('app', ['onsen']);

angular.module('appServices', ['ngResource']).factory('ParseService', function($resource) {

    // Initialize Parse API and objects.
    Parse.initialize("BiYJKFD8IxfkHxzoTxfW4nYE3im1Jvhc6Jy2v7j8", "AtXojjwtcnc4a6WkxJZcTrq7smHEe4iRI2EKYVIw");

    // Cache current logged in user
    var loggedInUser;

    // Define parse model and collection for Book records
    var Node = Parse.Object.extend("Node");
    var NodeCollection = Parse.Collection.extend({ model:Node });

    var ParseService = {
      name: "Parse",

      // Login a user
      login : function login(username, password, callback) {
    	  Parse.User.logIn(username, password, {
    	    success: function(user) {
            loggedInUser = user;
    	      callback(user);
    	    },
    	    error: function(user, error) {
    	      alert("Error: " + error.message);
    	    }
        });
      },

      // Login a user using Facebook
      FB_login : function FB_login(callback) {
        Parse.FacebookUtils.logIn(null, {
          success: function(user) {
            if (!user.existed()) {
              alert("User signed up and logged in through Facebook!");
            } else {
              alert("User logged in through Facebook!");
            }
            loggedInUser = user;
            callback(user);
          },
          error: function(user, error) {
            alert("User cancelled the Facebook login or did not fully authorize.");
          }
        });
      },

      // Register a user
      signUp : function signUp(username, password, callback) {
      	Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
            success: function(user) {
                loggedInUser = user;
                callback(user);
            },

            error: function(user, error) {
              alert("Error: " + error.message);
            }
        });
      },

      // Logout current user
      logout : function logout(callback) {
        Parse.User.logOut();
      },

      // Get All Nodes
      getNodes : function getNodes(callback) {
        var query = new Parse.Query(Node);
        //query.include('notes');
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

      // Get current logged in user
      getUser : function getUser() {
        if(loggedInUser) {
          return loggedInUser;
        }
      }

    };

    // The factory function returns ParseService, which is injected into controllers.
    return ParseService;
});
