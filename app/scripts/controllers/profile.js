'use strict';
/**
 * @ngdoc function
 * @name secretSantaApp.controller:ChatCtrl
 * @description
 * # ProfileCtrl
 *  for profile page
 */
angular.module('secretSantaApp')
  .controller('ProfileCtrl', ["$scope", "currentAuth", "$firebaseArray", "$timeout", "$firebaseObject", "firebaseUtilityService", "NetworkService", "$firebaseUtils",
    function ($scope, currentAuth, $firebaseArray, $timeout, $firebaseObject, firebaseUtilityService, NetworkService, $firebaseUtils) {

      $scope.loaded = false;
      $scope.newWishList = [];

      // // var email = "mahikanthnag.yalamarthi@accoliteindia.com";
      var email = currentAuth.email;
      firebaseUtilityService.getUserInformation(email, function (info) {
        info.$loaded().then(function () {
          $scope.info = info;
          $scope.loaded = true;
          $scope.user = $firebaseUtils.toJSON($scope.info);
        });
      });

      $scope.save = function () {
        $scope.user.id = $scope.info.$id;
        NetworkService.updateUser($scope.user.email, $scope.user);
      };

      $scope.add = function (wish) {
        $scope.user.wishlist.push(wish);
      };
    }]);
