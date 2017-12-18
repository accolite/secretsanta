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
      $scope.userData = {};

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
          delete $scope.user.santaEmailId;
          delete $scope.user.roomAsSanta;
          delete $scope.user.roomAsChild;
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
        if(angular.isUndefined(wish) || wish==='' || wish===' ')  {
          console.log('invalid wish');
        } else {
          $scope.user.wishlist.push(wish);
        }
      };

    }]);
