'use strict';

/**
 * @ngdoc function
 * @name secretSantaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the secretSantaApp
 */
angular.module('secretSantaApp')
  .controller('MainCtrl', ["auth", "$scope", "$location", "firebaseUtilityService", "$rootScope",
    function (auth, $scope, $location, firebaseUtilityService, $rootScope) {

    // $scope.isShake = false;

    $rootScope.$on('authData', function (event, data) {
      $scope.username = data.displayName || data.email;
    });

    firebaseUtilityService.showUserName(auth, function (username) {
      $scope.username = username;
    });

    $scope.logout = function () {
      auth.$signOut();
      console.log('logged out');
      $location.path('/');
      $scope.authData = null;
    };

    $rootScope.$on('auth_required', function (event, data) {
      // add shake animation
      console.log('shake now');
      console.log($scope.isShake);
      $scope.isShake = true;
      console.log($scope.isShake);
    });

    $scope.oauthLogin = function (provider) {
      firebaseUtilityService.oauthLogin(auth, provider);
    };

    firebaseUtilityService.getActivity(function (activites) {
      activites.$loaded().then(function () {
        $scope.activites = activites;
        // setFirebaseWatchers();
      });
    });

    // function setFirebaseWatchers() {
    //   $scope.activites.$watch(function (eventData) {
    //     if("child_added" === eventData.event) {
    //       var audio = new Audio('http://secret-santa.accolitelabs.com/sounds/notification.mp3');
    //       audio.play();
    //     }
    //   });
    // }

    $scope.getPanelBG = function (act) {
      var colors = [{'red': true}, {'blue': true}, {'green': true}, {'yellow': true}];
      // var randomNumber = (Math.floor(Math.random()*6 + 1)) % colors.length;
      if(act.event === 'add_task') {
        return colors[1];
      } else if(act.event === 'gift') {
        return colors[2];
      }
      return colors[0];
    };

    $scope.constructMessage = function (act) {
      switch(act.event) {
        case 'add_task' :
          return "A santa just challenged his child !";
        case 'gift':
          return "The amazing santa is planning to gift his child !";
      }
    };

    $scope.constructMessageHeading = function (act) {
      switch(act.event) {
        case 'add_task' :
          return "Santa Challenge";
        case 'gift':
          return "Santa is gifting";
      }
    }


  }]);
