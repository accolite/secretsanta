'use strict';

angular.module('secretSantaApp')
  .factory('NetworkService', ['$http', function ($http) {

      var obj = {};
      var bsse = 'https://secret-santa.accolitelabs.com'; // here : change production
      // var bsse = 'http://localhost:4000';
      // var bsse = 'http://192.168.43.47:4000';

      obj.updateUser = function (email, data) {
        return $http.post(bsse + '/api/user/update/?email=' + email, JSON.stringify(data));
      };

      obj.getUser = function (email) {
        return $http.get(bsse + '/api/user/?email=' + email);
      };

      obj.triggerEmailer = function (event, authData) {
        return $http.get(bsse + '/api/email/send/?event=' + event + '&user=' + authData.email);
      };

      return obj;
    }]);
