'use strict';

angular.module('firebase.Auth')
  .factory('firebaseUtilityService', ["$firebaseArray", "$firebaseObject",
    function ($firebaseArray, $firebaseObject) {

    var obj = {};

    obj.oauthLogin = function (auth, provider) {
      auth.$signInWithPopup(provider)
        .then(function (authData) {
          console.log("logged");
          if(authData.user.email.endsWith('accoliteindia.com') || authData.user.email.endsWith('accolitelabs.com')) {
            redirect(authData);
          } else {
            window.alert('sorry, you are permitted to play this amazing game!');
            auth.$signOut();
          }
        })
        .catch(function (error) {
          console.log("login error");
          showError(error);
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
        var q = rootRef.child('Employees').child(_o[0].$id);
        var o = $firebaseObject(q);
        cb(o);
      });
    };

    obj.getActivity = function (cb) {
        var query = rootRef.child('activity');
        var activities = $firebaseObject(query);
        cb(activities);
    };

    obj.getUserName = function (email) {
      // removes all special characters
      return email.replace(/[^a-zA-Z0-9]/g, "");
    };

    return obj;
  }]);
