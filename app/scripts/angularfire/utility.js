'use strict';

angular.module('firebase.Auth')
  .factory('firebaseUtilityService', ["$firebaseArray", "$firebaseObject", "$rootScope",
    function ($firebaseArray, $firebaseObject, $rootScope) {

    var obj = {};
    var _auth;

      function validateLogin(authData, logoutCB, next) {
        var isAccoliteEmployee = authData.user.email.endsWith('accoliteindia.com') || authData.user.email.endsWith('accolitelabs.com');
        if(isAccoliteEmployee) {
          obj.getUserInformation(authData.user.email, function (data) {
            if(angular.isUndefined(data) || data === null) {
              logoutCB();
            } else {
              next(authData);
            }
          })
        } else {
          logoutCB();
        }
      }

      function logout(auth) {
        window.alert('sorry, you are not allowed to play this amazing game');
        auth.$signOut();
      }

      function redirect(authData) {
        $rootScope.$emit('authData', authData);
        $location.path('/dashboard');
      }

      obj.oauthLogin = function (auth, provider) {
        _auth = auth;
      auth.$signInWithPopup(provider)
        .then(function (authData) {
          console.log("logged");
          validateLogin(authData, () => {
            logout(auth);
          }, redirect);
        })
        .catch(function (error) {
          console.log("login error");
          // showError(error);
        })
    };

    obj.showUserName = function (auth, cb) {
      console.log(auth.get);
    };

    obj.getRoomAndLoadMessages = function (room, cb) {
      $firebaseObject(rootRef.child(room)).$loaded().then(function (room) {
        if( room === null || angular.isUndefined(room)) {
          console.log('cannot find room');
          return;
        }
        var query = rootRef.child('rooms').child(room.$value).limitToLast(10);
        var messages = $firebaseArray(query);
        cb(messages);
      });
    };

    obj.getRoomAndLoadTasks = function (room, cb) {
      $firebaseObject(rootRef.child(room)).$loaded().then(function (room) {
        if( room === null || angular.isUndefined(room)) {
          console.log('cannot find room');
          return;
        }
        var query = rootRef.child('tasks').child(room.$value).child('santa');
        var tasks = $firebaseArray(query);
        cb(tasks);
      });
    };

    obj.getUserInformation = function (email, cb) {
      var query = rootRef.child('Employees').orderByChild("emailid").equalTo(email);
      var _o = $firebaseArray(query);
      _o.$loaded().then(function () {
        if(angular.isUndefined(_o[0])) {
          logout(_auth);
        }
        var q = rootRef.child('Employees').child(_o[0].$id);
        var o = $firebaseObject(q);
        cb(o);
      });
    };

    obj.getActivity = function (cb) {
        var query = rootRef.child('activity').limitToLast(30);
        var activities = $firebaseArray(query);
        cb(activities);
    };

    obj.getUserName = function (email) {
      // removes all special characters
      return email.replace(/[^a-zA-Z0-9]/g, "");
    };

    return obj;
  }]);
