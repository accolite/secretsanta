'use strict';
/**
 * @ngdoc function
 * @name secretSantaApp.controller:ChatCtrl
 * @description
 * # ProfileCtrl
 *  for profile page
 */
angular.module('secretSantaApp')
  .controller('ProfileCtrl', ["$scope", "currentAuth", "$firebaseArray", "$timeout", "$firebaseObject", "firebaseUtilityService", "NetworkService", "$firebaseUtils", "$routeParams", "$location",
    function ($scope, currentAuth, $firebaseArray, $timeout, $firebaseObject, firebaseUtilityService, NetworkService, $firebaseUtils, $routeParams, $location) {

      $scope.loaded = false;
      $scope.newWishList = [];

      // // var email = "mahikanthnag.yalamarthi@accoliteindia.com";
      if($routeParams.email) {
        var email = $routeParams.email;
        $scope.editable = false;
      } else {
        email = currentAuth.email;
        $scope.editable = true;
      }

      firebaseUtilityService.getUserInformation(email, function (info) {
        info.$loaded().then(function () {
          $scope.info = info;
          $scope.loaded = true;
          $scope.user = $firebaseUtils.toJSON($scope.info);
          if(angular.isUndefined($scope.user.wishlist)){
            $scope.user.wishlist = [];
          }
        });
      });

      $scope.save = function () {
        $scope.user.id = $scope.info.$id;
        NetworkService.updateUser($scope.user.emailid, $scope.user).then(function () {
          window.alert('updated!');
        });
      };

      $scope.add = function (wish) {
        $scope.user.wishlist.push(wish);
      };

    }]);
