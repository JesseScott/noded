'use strict';

/* Services */

angular.module('service', ['ngResource']).factory('ParseService', function($resource) {

    // Initialize Parse API
    Parse.initialize("BiYJKFD8IxfkHxzoTxfW4nYE3im1Jvhc6Jy2v7j8", "AtXojjwtcnc4a6WkxJZcTrq7smHEe4iRI2EKYVIw");

    // Cache Current User
    var loggedInUser;

    // Define Parse Model
    var Node = Parse.Object.extend("Node");

    var ParseService = {
      name: "Parse",

      /* USERS */

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

      // Register a user
      signUp : function signUp(username, password, email, callback) {
      	Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
            success: function(user) {
                user.set("email", email);
                loggedInUser = user;
                callback(user);
            },
            error: function(user, error) {
              alert("Error: " + error.message);
            }
        });
      },

      // Get current logged in user
      getUser : function getUser() {
        if(loggedInUser) {
          return loggedInUser;
        }
      },

      // Logout current user
      logout : function logout(callback) {
        Parse.User.logOut();
      },


      /* QUERIES */

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

      // Create A New Node
      addNote : function addNote(_obj, _note) {
        console.log('item is ' + _obj.id);
        console.log('note is ' + _note);

        var obj = new Node();
        obj.id = _obj.id;
        obj.addUnique('notes', _note);
        obj.save(null, {
          success: function(object) {
            //callback(object);
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
