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
      addNode : function addNode(_ssid, _pwd, _biz, _sec, _nts, _usr, _loc, _img) {

        if(_ssid == null || _pwd == null || _biz == null || _sec == null) {
            alert('please fill in all fields');
            return;
        }

        if(_nts == null) _nts == " ";
        var _ntsArray = [_nts];

        console.log('NET: ' + _ssid);
        console.log('PWD: ' + _pwd);
        console.log('BIZ: ' + _biz);
        console.log('SEC: ' + _sec);
        console.log('NTS: ' + _nts);
        console.log('USR: ' + _usr);
        console.log('LOC: ' + _loc);
        console.log('IMG: ' + _img);

        var object = new Node();
        object.save({ssid:_ssid, password:_pwd, owner:_biz, security:_sec, notes:_ntsArray, addedBy:_usr /*, point:_loc, thumbnail:_img*/}, {
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
          success: function() {
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
