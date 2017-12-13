'use strict';

angular.module('secretSantaApp')
  .factory('NetworkService', ['$http', function ($http) {

      var obj = {};

      obj.getUser = function (email) {
        console.log('get user object');
      };

      obj.updateUser = function (email, data) {
        console.log('get user object');
      };

      obj.triggerEmailer = function (event, authData) {
        console.log('email');
        // $http.post('/email/send/?event=' + event, authData);
      };

      return obj;
    }]);
