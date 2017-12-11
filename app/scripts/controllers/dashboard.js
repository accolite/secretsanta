'use strict';
/**
 * @ngdoc function
 * @name secretSantaApp.controller:ChatCtrl
 * @description
 * # DashboradCtrl
 * Handler for santa-child login
 */
angular.module('secretSantaApp')
  .controller('DashboardCtrl', ["$scope", "currentAuth", "$firebaseArray", "$timeout", "$firebaseObject", "firebaseUtilityService", "$route",
    function ($scope, currentAuth, $firebaseArray, $timeout, $firebaseObject, firebaseUtilityService, $route) {


      $scope.user = currentAuth;
      $scope.loaded = false;

      var roomPointerName = '';
      if($route.current.$$route.originalPath === "/dashboard/santa") {
        roomPointerName = '/roomAsSanta';
      } else {
        roomPointerName = '/roomAsChild';
      }

      $scope.isTasksWrite = roomPointerName !== '/roomAsChild';

        firebaseUtilityService.getRoomAndLoadMessages('users/' + firebaseUtilityService.getUserName(currentAuth.email) + roomPointerName, function (messages) {
        messages.$loaded()
          .then(function () {
            $scope.messages = messages;
            $scope.loaded = true;
          })
          .catch(alert);
      });

      firebaseUtilityService.getRoomAndLoadTasks('users/' + firebaseUtilityService.getUserName(currentAuth.email) + roomPointerName, function (tasks) {
        tasks.$loaded()
          .then(function () {
            $scope.tasks = tasks;
            $scope.tasksLoaded = true;
            setFirebaseWatchers();
          })
          .catch(alert);
      });

      // function setFirebaseWatchers() {
      //   $scope.tasks.$watch(function (eventData) {
      //     if("child_changed" === eventData.event) {
      //       console.log('find the event status and if true, emit an event key', eventData.key);
      //     } else if("child_added" === eventData.event) {
      //       firebaseUtilityService.getActivity('task_added', {user: $scope.user, taskId: eventData.key});
      //     }
      //   });
      //   $scope.tasks.off();ut
      // }

      // provide a method for adding a message
      $scope.addMessage = function (newMessage) {
        if (newMessage) {
          // push messages to the end of the array
          $scope.messages.$add({
            text: newMessage,
            userId: currentAuth.uid
          }).catch(alert);
        }
      };

      $scope.addTask = function (newTask) {
        if(newTask) {
          $scope.tasks.$add({
            text: newTask,
            userId: currentAuth.uid,
            completed: false
          }).then(
            firebaseUtilityService.getActivity(function (activities) {
              activities.$add({
                event: 'task_added',
                src: $scope.user.email,
                uid: $scope.user.uid
              });
            })
          )
          .catch(alert);
        }
      };

      $scope.deleteTask = function (task) {
        const _response = window.confirm("do you want to perform this ?");
        if(_response) {
          if(task) {
            $scope.tasks.$remove(task)
              .catch(alert);
          }
        }
      };

      $scope.updateTaskStatus = function (task) {
        const _response = window.confirm("do you want to perform this ?");
        if(_response) {
          $scope.tasks.$save(task);
        } else {
          // revert the change
          task.completed = !task.completed;
        }
      };

      $scope.sendAGift = function () {
        console.log('send a gift button pressed, ')
      };

      $scope.getEmptyTasksContext = function () {
        if($scope.isTasksWrite) {
          //santa
          return "Give some tasks to your child!";
        } else {
          return "Your santa did not give you tasks";
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
