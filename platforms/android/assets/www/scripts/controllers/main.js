'use strict';

var DevpushApp_controllers = angular.module('DevpushApp.controllers', ['DevpushApp.services', 'firebase', 'AngularGM']);

var SignsCtrl = DevpushApp_controllers.controller('SignsCtrl',  ['$scope', 'AuthService', '$location', '$rootScope', 'angularFire',
 function ($scope, auth, loc, $rootScope, angularFire) {
  // init user
   var ref = new Firebase('https://realtime-map.firebaseio.com/markers');
  angularFire(ref, $scope, "profiles");
  $scope.user = {};
  var handleError = function(event, error) {
    $scope[event.name] = true;
    $scope.error = error.message;
    // console.log(error)
    auth.setProcessing(false)
     if(!$scope.$$phase) $scope.$apply();
  }
  $scope.addUser = function (user){
    // $scope.users.push(user);
    //console.log($scope.user);
    // console.log(pass);
    // console.log(auth)
    auth.createUser(user);
  }
  var type = "password"
  $scope.login = function(user) {
    $scope.error = null;
    auth.login("password", user);
  }

  $scope.fbLogin = function() {
    //remove error
    $scope.error = null;
    // login facebook
    auth.login('facebook');
  }

  $scope.$on('errorLogin', handleError);
  $scope.$on('errorSignup', handleError);
  $scope.$on('userCreated', function(event, currentUser) {
    // add new user
    $scope.profiles[currentUser.id] = $scope.user;
    // login user
    $scope.login({
      uEmail: $scope.user.Email,
      uPass: $scope.user.Pass
    })
    
  });

  $scope.$on('connected',function (event, currentUser) {
    console.log('connected')
      // confirm new user
      // console.log(currentUser)
    $scope.profiles[currentUser.id] = currentUser;
    $scope.profiles[currentUser.id].connected = true;
    loc.path('/');
  })

}])

SignsCtrl.checkLogin = function (AuthService, $q, $rootScope) {
  // body...
  // console.log(SignsCtrl)
   var deferred = $q.defer();
   // $scope.$apply(function())
  if(AuthService.isLoggedIn()){
  console.log(AuthService.isLoggedIn())
       var error = {
          type: 'alert',
          message: 'You are already login !'
        }
        $rootScope.$broadcast('logevent', error)
        deferred.reject('login !');          
   }
    else { 
      deferred.resolve();
   }
     return deferred.promise;

}
var EditCtrl = DevpushApp_controllers.controller('EditCtrl', ['$timeout', '$scope','AuthService', '$stateParams', 'angularFire', '$state', 'angulargmContainer',
  function ($timeout, $scope, auth, params, angularFire, $state, logged, permissions, angulargmContainer ) {
    // console.log(EditCtrl.checkUserPermissions())

    if(!EditCtrl.checkLogged($scope, auth)) {
      $state.go('login');  
      return;
    }  
    else {
    //   // $scope.user = auth.user;
      // console.log($scope.user);
       $scope.tabUrl = 'views/editProfile/profile.html';

      var id = auth.getCurrentUserId();
      var ref = new Firebase('https://realtime-map.firebaseio.com/markers/' + id);

      ref.onDisconnect().update({
        connected: false
      })
      angularFire(ref, $scope, "user").then(function() {
        
        var options = {
          enableHighAccuracy : true,
          maximumAge : 0
        }
        $timeout(function() {

          // navigator.geolocation.getCurrentPosition($scope.logLocation)
          var watchId = navigator.geolocation.watchPosition($scope.logLocation, $scope.errorLocation, options)
        },100)
        $scope.user.connected = auth.isLoggedIn();

      })
      $scope.logout = function() {
        $scope.user.connected = false;
        $timeout(function() {

          auth.logout();
          $state.go('login')
        })
      }
      $scope.logLocation = function (position) {
        // console.log(position)
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        $scope.user.location = {
          lat: lat,
          lng: lng
        }
        // $scope.setCenter(lat, lng);  
        var address = new google.maps.LatLng(lat, lng)
        $timeout(function() {
          $scope.setAddress(address)
        })
        
      } 
      $scope.errorLocation = function (error) {
        console.log(error)
      }
      
      $scope.address = [{
          name: 'myHouse',
          lat: 1.22, 
          lng: -4.12,
        }];

       $scope.options = {
          map: {
            center: new google.maps.LatLng(7.22, -4.12),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          },
          marker: {
            clickable: false,
            draggable: true 
          }
        };
      // tabs
      $scope.setCenter = function(lat ,lng) {
         
        $scope.center = new google.maps.LatLng(lat, lng);
      }
      $scope.setZoom = function(zoom) {
        $scope.zoom = zoom
      }
      $scope.marker;

       $scope.$on('gmMarkersUpdated', function(event, params){
         $scope.marker = params
          // console.log(params)
        });

      $scope.getAddress = function(object, marker) 
      {
        var position = marker.getPosition();
        console.log(position)
        $scope.user.location = {
          lat: position.lat(),
          lng: position.lng()
        }
      }
      $scope.setAddress = function(address) {
        // console.log(address)
        // console.log($scope.marker)
        // if get my event
        // console.log($scope.marker)
        if($scope.marker) $scope.marker.setPosition(address);
        // $timeout(function() {
          $scope.center = address
        // }, 10)
        // console.log($scope.user)
       
      } 
    }
  }])

EditCtrl.checkLogged = function($rootScope, AuthService) {
 
  // console.log(AuthService.getUserData())
  if(!AuthService.isLoggedIn())
  {
      // alert('asdf')
        var error = {
          type: 'alert',
          message: 'You have to login first !'
        }
        // $state.go('login')
        // $rootScope.$broadcast('logevent', error);

        return false;
   }
    else { 
      return true;
   }
}


EditCtrl.checkUserPermissions = function($rootScope, AuthService, $stateParams) {

  // console.log(AuthService.getUserData().id)
  // console.log($stateParams.userId);
  // $rootScope.$on("$stateChangeStart", function(event,))
  var id = AuthService.getCurrentUserId();
  // console.log($stateParams.userId == data.id)
   if($stateParams.userId !== id)
   {

      var error = {
        type: 'alert',
        message: 'Not cool man'
      }

      $rootScope.$broadcast('logevent', error);
      return false
   }
    else { 
      return true;
    }

}

EditCtrl.loadData = function(AuthService, $q, $rootScope, $stateParams) {
  // console.log($stateParams)
      var deferred = $q.defer()

      AuthService.connect().then(function(auth) {
        deferred.resolve(auth);
      })

      return deferred.promise
    }

EditCtrl.mapsEvent = function(map) {


}