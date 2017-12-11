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
      var tasksAsSanta;
      var tasksAsChild;
      $scope.loaded = false;

      firebaseUtilityService.getRoomAndLoadMessages('users/' + firebaseUtilityService.getUserName(currentAuth.email) + '/roomAsSanta', function (messages) {
        messages.$loaded()
          .then(function (data) {
            $scope.messages = data;
            $scope.loaded = true;
          })
          .catch(alert);
      });

      firebaseUtilityService.getRoomAndLoadTasks('users/' + firebaseUtilityService.getUserName(currentAuth.email) + '/roomAsSanta', function (tasksAsSanta) {
        tasksAsSanta.$loaded()
          .then(function (data) {
            $scope.tasksAsSanta = data;
            $scope.tasksLoaded = true;
          })
          .catch(alert);
      });

      firebaseUtilityService.getRoomAndLoadTasks('users/' + firebaseUtilityService.getUserName(currentAuth.email) + '/roomAsChild', function (tasksAsChild) {
        tasksAsChild.$loaded()
          .then(function (data) {
            $scope.tasksAsChild = data;
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
          }).catch(alert);
        }
      };

      $scope.addSantaTask = function (newTask) {
        if(newTask) {
          $scope.tasksAsSanta.$add({
            text: newTask,
            user: currentAuth.email,
            userId: currentAuth.uid,
            completed: false
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
