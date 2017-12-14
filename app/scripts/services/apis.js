'use strict';

angular.module('secretSantaApp')
  .factory('NetworkService', ['$http', function ($http) {

      var obj = {};
      var bsse = 'http://innovations.accolite.com';
      // var bsse = 'http://localhost:4000';
      // var bsse = 'http://192.168.43.47:4000';

      obj.getUser = function (email) {
        console.log('get user object');
      };

      obj.updateUser = function (email, data) {
        return $http.post(bsse + '/user/update/?email=' + email, JSON.stringify(data));
      };

      obj.triggerEmailer = function (event, authData) {
        return $http.get(bsse + '/email/send/?event=' + event + '&user=' + authData.email);
      };

      return obj;
    }]);
