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
        var query = rootRef.child('tasks').child(room.$value).child('santa');
        var tasks = $firebaseArray(query);
        cb(tasks);
      });
    };

    obj.getActivity = function (cb) {
      if(event === 'task_added') {
        var query = rootRef.child('activity');
        var activities = $firebaseArray(query);
        console.log("add to activity...");
        cb(activities);
      }
    };

    obj.loadActivities = function (cb) {
      var query = rootRef.child('activity');
      var activities = $firebaseArray(query);
      cb(activities);
    };

    obj.getUserName = function (email) {
      // removes all special characters
      return email.replace(/[^a-zA-Z0-9]/g, "");
    };

    return obj;
  }]);
