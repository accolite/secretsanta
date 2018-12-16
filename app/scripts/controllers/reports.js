'use strict';
/**
 * @ngdoc function
 * @name secretSantaApp.controller:ReportCtrl
 * @description
 * # DashboradCtrl
 * Handler for santa-child login
 */
angular.module('secretSantaApp')
    .controller('ReportCtrl', ["auth", "$scope", "$location", "firebaseUtilityService", "$rootScope",
        function (auth, $scope, $location, firebaseUtilityService, $rootScope) {

            firebaseUtilityService.getReports(function (reports) {
                reports.$loaded().then(function () {
                    $scope.reports = reports;
                    console.log(reports);

                });
            });

        }]);
