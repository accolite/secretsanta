'use strict';
/**
 * @ngdoc function
 * @name secretSantaApp.controller:ChatCtrl
 * @description
 * # ProfileCtrl
 *  for profile page
 */
angular.module('secretSantaApp')
  .controller('ProfileCtrl', ["$scope", "currentAuth", "$firebaseArray", "$timeout", "$firebaseObject", "firebaseUtilityService", "NetworkService",
    function ($scope, currentAuth, $firebaseArray, $timeout, $firebaseObject, firebaseUtilityService, NetworkService) {

      $scope.loaded = false;
      $scope.newWish = '';

      // // var email = "mahikanthnag.yalamarthi@accoliteindia.com";
      // var email = currentAuth.email;
      // firebaseUtilityService.getUserInformation(email, function (info) {
      //   info.$loaded().then(function () {
      //     $scope.info = info;
      //     $scope.loaded = true;
      //   });
      // });
      //
      // $scope.save = function () {
      //   $scope.info[0].gender = $scope.new.gender;
      //   $scope.info.$save();
      // };
      //
      // $scope.add = function (wish) {
      //   $scope.info.child('wishlist').update({
      //     item: wish
      //   })
      // };




    }]);
