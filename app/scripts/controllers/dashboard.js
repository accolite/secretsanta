'use strict';
/**
 * @ngdoc function
 * @name secretSantaApp.controller:ChatCtrl
 * @description
 * # DashboradCtrl
 * Handler for santa-child login
 */
angular.module('secretSantaApp')
  .controller('DashboardCtrl', ["$scope", "currentAuth", "$firebaseArray", "$timeout", "$firebaseObject", "firebaseUtilityService",
    function ($scope, currentAuth, $firebaseArray, $timeout, $firebaseObject, firebaseUtilityService) {


      $scope.user = currentAuth;
      var messages;
      var tasks;
      $scope.loaded = false;

      // $firebaseObject(rootRef.child('users/' + $scope.user.uid.toString() + '/room')).$loaded().then(function (room) {
      //   if( room === null || angular.isUndefined(room)) {
      //     console.log('cannot find room');
      //     return;
      //   }
      //   console.log('user', $scope.user);
      //   var query = rootRef.child('rooms').child(room.$value).limitToLast(10);
      //   messages = $firebaseArray(query);
      //
      //   messages.$loaded()
      //     .then(function () {
      //       $scope.messages = messages;
      //       $scope.loaded = true;
      //     })
      //     .catch(alert);
      // });

      firebaseUtilityService.getRoomAndLoadMessages('users/' + firebaseUtilityService.getUserName(currentAuth.email) + '/room', function (messages) {
        messages.$loaded()
          .then(function (data) {
            $scope.messages = data;
            $scope.loaded = true;
          })
          .catch(alert);
      });

      firebaseUtilityService.getRoomAndLoadTasks('users/' + firebaseUtilityService.getUserName(currentAuth.email) + '/room', function (tasks) {
        tasks.$loaded()
          .then(function (data) {
            $scope.tasks = data;
            $scope.tasksLoaded = true;
          })
          .catch(alert);
      });

      // provide a method for adding a message
      $scope.addMessage = function (newMessage) {
        if (newMessage) {
          // push messages to the end of the array
          $scope.messages.$add({
            text: newMessage,
            user: currentAuth.email,
            userId: currentAuth.uid
          })
            .catch(alert);
        }
      };

      $scope.addTask = function (newTask) {
        if(newTask) {
          $scope.tasks.$add({
            text: newTask,
            user: currentAuth.email,
            userId: currentAuth.uid
          })
            .catch(alert);
        }
      };

      $scope.getClass = function (msg) {
        if(msg.userId === currentAuth.uid) {
          return {'panel-me': true, 'activity-me': true};
        }
        return {'panel-others': true, 'activity-others': true};
      };

      function alert(msg) {
        $scope.err = msg;
        console.log(msg);
        $timeout(function () {
          $scope.err = null;
        }, 5000);
      }
    }]);
