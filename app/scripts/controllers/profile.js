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

      getUserInformation();

      function getUserInformation() {
        NetworkService.getUser(email).then(function(data) {
          $scope.user = data.data;
          $scope.loaded = true;
          if(angular.isUndefined($scope.user.wishlist)){
            $scope.user.wishlist = [];
          }
        });
      }

      $scope.save = function () {
        // $scope.user.id = $scope.info.$id;
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
