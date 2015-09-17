'use strict';

/* Services */

angular.module('service', ['ngResource'])

/* PARSE FACTORY */
.factory('ParseService', function($resource) {

    // Initialize Parse API
    Parse.initialize("BiYJKFD8IxfkHxzoTxfW4nYE3im1Jvhc6Jy2v7j8", "AtXojjwtcnc4a6WkxJZcTrq7smHEe4iRI2EKYVIw");

    // Cache Current User
    var loggedInUser;

    // Define Parse Models
    var Node = Parse.Object.extend("Node");
    var Fave = Parse.Object.extend("Fave");

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
        // if(loggedInUser) {
        //   return loggedInUser;
        // }
        return Parse.User.current();
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
      addNode : function addNode(_ssid, _pwd, _biz, _sec, _nts, _usr, _loc, _img, callback) {

        if(_ssid == null || _pwd == null || _biz == null || _sec == null) {
            alert('please fill in all fields');
            return;
        }

        if(_nts == null) _nts == "";
        var _ntsArray = [_nts];

        if(_loc == null) {
          _loc = new Parse.GeoPoint(0.0, 0.0);
        }

        /*
        var img;
        if(_img == null) {
          img = new Image();
          img.src = "img/foo.jpg"; // sketchy
          _img = img;
          //console.log(img);
        }
        var parseFile = new Parse.File("image.jpg", _img);
        //console.log(parseFile);
        parseFile.save().then(
        function() {
          console.log('File Saved...');
          //supposed to call Object save here ???
        },
        function(error) {
          console.log('File Error: ' + error.code);
        });
        */
        console.log('NET: ' + _ssid);
        console.log('PWD: ' + _pwd);
        console.log('BIZ: ' + _biz);
        console.log('SEC: ' + _sec);
        console.log('NTS: ' + _nts);
        console.log('USR: ' + _usr);
        console.log('LOC: ' + _loc);
        console.log('IMG: ' + _img);

        var params = {
          ssid:_ssid,
          password:_pwd,
          owner:_biz,
          security:_sec,
          notes:_ntsArray,
          addedBy:_usr,
          point:_loc/*,
          thumbnail:parseFile // ERROR*/
        };

        var object = new Node();
        object.save(params, {
          success: function(object) {
            callback();
          },
          error: function(error) {
            alert("Error: " + error.message);
          }
        });
      },

      // Add Favourite
      favouriteNode : function favouriteNode(_node, callback) {
        console.log('node is ' + _node.id);

        var params = {
          Node:_node,
          User:loggedInUser
        };

        var obj = new Fave();
        obj.save(params, {
          success: function(obj) {
            console.log('faved!');
            callback(obj);
          },
          error: function(error) {
            alert("Error: " + error.message);
          }
        });
      },

      // Update
      updateNode : function updateNode(_obj, _update, callback) {
        console.log('item is ' + _obj.id);
        console.log('update is ' + _update);

        // var obj = new Node();
        // obj.id = _obj.id;
        // obj.save(null, {
        //   success: function(obj) {
        //     //callback(obj);
        //   },
        //   error: function(error) {
        //     alert("Error: " + error.message);
        //   }
        // });
      },

      // Add Comment
      commentNode : function commentNode(_obj, _note, callback) {
        console.log('item is ' + _obj.id);
        console.log('note is ' + _note);

        var obj = new Node();
        obj.id = _obj.id;
        obj.addUnique('notes', _note);
        obj.save(null, {
          success: function(obj) {
            callback(obj);
          },
          error: function(error) {
            alert("Error: " + error.message);
          }
        });
      },

    };

    // The factory function returns ParseService, which is injected into controllers.
    return ParseService;
})

/* PHONEGAP FACTORIES */

.factory('phonegapReady', function() {
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
})
.factory('geolocation', function ($rootScope, phonegapReady) {
  return {
    getCurrentPosition: function (onSuccess, onError, options) {
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
        }
    };
});



;
