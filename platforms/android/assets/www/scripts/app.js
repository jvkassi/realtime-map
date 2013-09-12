'use strict';

// var DevpushApp = angular.module('DevpushApp', ['ngRoute', 'firebase','DevpushApp.services', 'DevpushApp.controllers', 'DevpushApp.directives', 'DevpushApp.providers']);
var DevpushApp = angular.module('DevpushApp', ['ui.router', 'firebase', 'DevpushApp.controllers', 'DevpushApp.directives', 'DevpushApp.services']);

DevpushApp.config(['$urlRouterProvider', '$stateProvider',  function ($routeProvider, $stateProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/profile.html',
        controller: 'EditCtrl',
        resolve: {
          loadData: EditCtrl.loadData,
           // checkLogged : EditCtrl.checkLogged,
           // checkUserPermissions: EditCtrl.checkUserPermissions
         }
        })
        .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'SignsCtrl',
        resolve: {
          loadData: EditCtrl.loadData,
           // checkLogged : EditCtrl.checkLogged,
           // checkUserPermissions: EditCtrl.checkUserPermissions
         }
        })
        .state('admin', {
        url: '/admin',
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl',
        resolve: {
          // loadData: EditCtrl.loadData,
           // checkLogged : EditCtrl.checkLogged,
           // checkUserPermissions: EditCtrl.checkUserPermissions
         }
        })
        .state('404', {
          url: '/404',
          templateUrl: 'views/404.html',
          // controller: 'EditCtrl'
        })

    // if no state found
    $routeProvider.otherwise("404")
}]);
DevpushApp.run(['AuthService', '$rootScope', '$state', 'angulargmContainer',
 function(auth, $rootScope, $state, angulargmContainer) {
  // google.maps.visualRefresh = true;

 $rootScope.$on('$stateChangeError', function() {
        // console.log(error);
        // change state 
          $state.go('home')
       
      })

}])
