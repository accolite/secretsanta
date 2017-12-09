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

    // SignIn with a Provider
    $scope.oauthLogin = function (provider) {
      auth.$signInWithPopup(provider)
        .then(function (authData) {
          console.log("logged");
          redirect(authData);
        })
        .catch(function (error) {
          console.log("login error");
          showError(error);
        })
    };

  }]);
