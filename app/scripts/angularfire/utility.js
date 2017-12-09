'use strict';

angular.module('firebase.Auth')
  .factory('firebaseUtilityService', ["$firebaseArray", "$firebaseObject",
    function ($firebaseArray, $firebaseObject) {

    var obj = {};

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
        var query = rootRef.child('tasks').child(room.$value);
        var tasks = $firebaseArray(query);
        cb(tasks);
      });
    };

    obj.getUserName = function (email) {
      // removes all special characters
      return email.replace(/[^a-zA-Z0-9]/g, "");
    };

    return obj;
  }]);
