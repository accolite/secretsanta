'use strict';

angular.module('secretSantaApp')
  .factory('NetworkService', ['$http', function ($http) {

      var obj = {};
      var bsse = 'http://localhost:4000';

      obj.getUser = function (email) {
        console.log('get user object');
      };

      obj.updateUser = function (email, data) {
        $http.post(bsse + '/update/user/?email=' + email, data);
      };

      obj.triggerEmailer = function (event, authData) {
        $http.get(bsse + '/email/send/?event=' + event + '&user=' + authData.email);
      };

      return obj;
    }]);
