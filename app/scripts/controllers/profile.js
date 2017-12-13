'use strict';
/**
 * @ngdoc function
 * @name secretSantaApp.controller:ChatCtrl
 * @description
 * # ProfileCtrl
 *  for profile page
 */
angular.module('secretSantaApp')
  .controller('ProfileCtrl', ["$scope", "currentAuth", "$firebaseArray", "$timeout", "$firebaseObject", "firebaseUtilityService",
    function ($scope, currentAuth, $firebaseArray, $timeout, $firebaseObject, firebaseUtilityService) {

      $scope.loaded = false;
      $scope.newWish = '';

      var email = "mahikanthnag.yalamarthi@accoliteindia.com";
      firebaseUtilityService.getUserInformation(email, function (info) {
        info.$loaded().then(function () {
          $scope.info = info;
          $scope.loaded = true;
        });
      });


    }]);
