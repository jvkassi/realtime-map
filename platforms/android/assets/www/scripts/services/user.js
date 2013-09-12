'use strict';

var DevpushApp_providers = angular.module('DevpushApp.providers', []);

DevpushApp_providers.provider('Config', function () {

    // private
    var config = {};
    config.fireUrl = "https://realtime-map.firebaseio.com/";

    // Contstrutctor
    config.ref = new Firebase(config.fireUrl);
    function Config() {
      return config;
    }
    // get method
    this.$get = function() {
      return Config();
    }

  });
DevpushApp_providers.provider('CheckPermissions', function () {

    // private
    var config = {};
    config.fireUrl = "https://devpush.firebaseio.com/";

    // Contstrutctor
    function Config() {
      return config;
    }

    // get method
    this.$get =  function (AuthService, $q, $rootScope) {
  // body...
   console.log(!AuthService.isLoggedIn())
   var deferred = $q.defer();
  if(AuthService.isLoggedIn()){
        $rootScope.$broadcast('logevent', 'You are already login !')
        deferred.reject('login !');          
   }
    else { 
      deferred.resolve();
   }
     return deferred.promise;

}

  });
DevpushApp_providers.provider('User', function () {
    // var auth = angular.$injector(['DevpushApp.services']).get('AuthService');
    // Private variables
    var user = {};
    user.processing = true;
    // Guess that the user is connected
    user.connected = true;
    // Private constructor
    function User() {
      return user;
    }

    // Public API for configuration
    this.setSalutation = function (s) {
      salutation = s;
    };
    user.setConnected = function (bool) {
      user.connected = bool;
    };
    user.setProcessing = function (bool) {
      user.processing = bool;
    };
    user.merge = function(u) {
      for(var attr in u) { user[attr] = u[attr]}
    }
    user.logout = function() {
      // auth.logout();
      return
    };
    // Method for instantiating
    this.$get = function () {
      return User();
      // return {
      //       setConnected: function(connected) {
      //           user.connected = connected;
      //       }
      //   }
    };

  });
