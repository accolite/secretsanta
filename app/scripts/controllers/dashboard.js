'use strict';
/**
 * @ngdoc function
 * @name secretSantaApp.controller:ChatCtrl
 * @description
 * # DashboradCtrl
 * Handler for santa-child login
 */
angular.module('secretSantaApp')
  .controller('DashboardCtrl', ["$scope", "currentAuth", "$firebaseArray", "$timeout", "$firebaseObject", "firebaseUtilityService", "$route", "NetworkService", "$location",
    function ($scope, currentAuth, $firebaseArray, $timeout, $firebaseObject, firebaseUtilityService, $route, NetworkService, $location) {


      $scope.emojiMessage={};
      $scope.user = currentAuth;
      $scope.loaded = false;

      var roomPointerName = '';
      if($route.current.$$route.originalPath === "/dashboard/santa") {
        roomPointerName = '/roomAsSanta';
      } else {
        roomPointerName = '/roomAsChild';
      }

      $scope.isSanta = roomPointerName !== '/roomAsChild';

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
          })
          .catch(alert);
      });

      // provide a method for adding a message
      $scope.addMessage = function (newMessage) {
        if (newMessage) {
          // push messages to the end of the array
          $scope.messages.$add({
            text: newMessage,
            userId: currentAuth.uid,
            timestamp: Date.now()
          }).catch(alert);
          var objDiv = document.getElementById("chat");
          objDiv.scrollTop = objDiv.scrollHeight;
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
              console.log('adding activity here');
              activities.$add({
                event: 'add_task',
                uid: $scope.user.uid,
                timestamp: Date.now()
              }).then(function () {
                var utterThis = new SpeechSynthesisUtterance("Santa added a new task!");
                utterThis.voice = speechSynthesis.getVoices().filter(s => s.name.match("Zira | Female"))[0];
                window.speechSynthesis.speak(utterThis)
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
        if($scope.isSanta) {
          const _response = window.confirm("do you want to perform this ?");
          if(_response) {
            $scope.tasks.$save(task).then(function () {
              if(task.completed) {
                NetworkService.triggerEmailer('addTask', currentAuth);
              }
            });
          } else {
            // revert the change
            task.completed = !task.completed;
          }
        }
      };

      $scope.sendAGift = function (content) {
        console.log('send a gift button pressed, ', content);
        // add to messages as a special message
        var image = 'santa-gift';
        $scope.messages.$add({
          text: "<img src=\"images/"+ image + ".gif\" height=\"30px\"> <br>" + content,
          userId: currentAuth.uid,
          type: 'special_gift'
        }) .then(
          firebaseUtilityService.getActivity(function (activities) {
            activities.$add({
              event: 'gift',
              uid: $scope.user.uid,
              timestamp: Date.now()
            });
            NetworkService.triggerEmailer('gift', currentAuth);
          })
        )
          .catch(alert);
      };

      $scope.poke = function () {
        console.log('send a email to santa', $scope.isSanta);
        if($scope.isSanta) {
          var event = 'poke_child';
          var image = 'poke-child2';
        } else {
          event = 'poke_santa';
          image = 'poke-santa';
        }
        $scope.messages.$add({
          text: "<img src=\"images/"+ image + ".gif\" height=\"30px\">",
          userId: currentAuth.uid,
          type: 'special_' + event
        }) .then(function () {
          NetworkService.triggerEmailer(event, currentAuth);
        });
      };

      $scope.getEmptyTasksContext = function () {
        if($scope.isSanta) {
          //santa
          return "Give some tasks to your child!";
        } else {
          return "Your santa did not give you tasks";
        }
      };

      $scope.getClass = function (msg) {
        var _o = {};
        if(msg.userId === currentAuth.uid) {
          // _o = {'panel-me': true, 'activity-me': true};
          _o = {'bubble-right': true};
          if(msg.type === 'special') {
            _o['special-msg'] = true;
          }
        }
        else {
          // _o ={'panel-others': true, 'activity-others': true};
          _o ={'bubble-left': true};
          if(msg.startsWith === 'special') {
            _o['special-msg-others'] = true;
          }
        }
        return _o;
      };

      $scope.goToChildProfile = function () {
        firebaseUtilityService.getUserInformation(currentAuth.email, function (allData) {
          allData.$loaded().then(function () {
            $location.path('/profile/' + allData.childEmailId);
          });
        });
      };

      function alert(msg) {
        $scope.err = msg;
        console.log(msg);
        $timeout(function () {
          $scope.err = null;
        }, 5000);
      }
    }]);
