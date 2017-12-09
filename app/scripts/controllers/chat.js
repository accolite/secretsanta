'use strict';
/**
 * @ngdoc function
 * @name secretSantaApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * A demo of using AngularFire to manage a synchronized list.
 */
angular.module('secretSantaApp')
  .controller('Chat', ["$scope", "currentAuth", "$firebaseArray", "$timeout", "$firebaseObject",
    function ($scope, currentAuth, $firebaseArray, $timeout, $firebaseObject) {

    $scope.user = currentAuth;
    var messages;
    $scope.loaded = false;

    $firebaseObject(rootRef.child('users/' + $scope.user.uid.toString() + '/room')).$loaded().then(function (room) {
      if( room === null || angular.isUndefined(room)) {
        console.log('cannot find room');
        return;
      }
      console.log('user', $scope.user);
      var query = rootRef.child('rooms').child(room.$value).limitToLast(10);
      messages = $firebaseArray(query);

      messages.$loaded()
        .then(function () {
          $scope.messages = messages;
          $scope.loaded = true;
        })
        .catch(alert);
    });

    // provide a method for adding a message
    $scope.addMessage = function (newMessage) {
      if (newMessage) {
        // push messages to the end of the array
        $scope.messages.$add({
          text: newMessage,
          user: currentAuth.displayName,
          userId: currentAuth.uid
        })
          .catch(alert);
      }
    };

    function alert(msg) {
      $scope.err = msg;
      console.log(msg);
      $timeout(function () {
        $scope.err = null;
      }, 5000);
    }
  }]);
