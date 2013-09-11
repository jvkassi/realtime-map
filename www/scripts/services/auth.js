'use strict';

var DevpushApp_services = angular.module('DevpushApp.services', ['DevpushApp.providers']);

DevpushApp_services.factory('Profiles', ['angularFireCollection', 'Config',
 function (angularFireCollection ,  Config) {
	return angularFireCollection(Config.ref)
}])

DevpushApp_services.factory('AuthService', ['$rootScope', '$location', '$q', 'User', 'Config', 'angularFireCollection',
 function ($rootScope, $location, $q, User, Config, angularFireCollection ) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var auth = {};
    // console.log(Config.f)

    // console.log('conect')
    // useful functions
	auth.broadcastEvent = function(event, params) {
	    $rootScope.$broadcast(event, params);
	};
	
	// $rootScope.$apply();
	return {
		profiles: function() {
			// return angularFireCollection(fbUrl + "/profile")
		},
		getCurrentUser: function () {
			// console.log(auth)
			return auth.currentUser;
		},
		getCurrentUserId: function () {
			return auth.currentUser.id;
		},
		setProcessing: function(bool) {
			User.setProcessing(bool)
		},
		isLoggedIn: function() {
			return User.connected;
		},
		// return user 
		getUserData : function() {
			 // alert('sadf'); 
			 return User;
			//  var deferred = $q.defer();
			
			//  	this.connect().then(function(e) {
			// 		deferred.resolve(User);
			// 	})
			// return deferred.promise

		},
		// first connect function on promise
		connect: function() {
			var service = this;
			var deferred = $q.defer();
			auth.client = new FirebaseSimpleLogin(Config.ref, function(error, user) {	
			
				if(error) {
					auth.broadcastEvent('errorLogin', error);
					auth.resolve = error;
					// User.setConnected(false);
					deferred.resolve(service)
				}
				else if(user) {
					// console.log(user + ' connect !');
					auth.broadcastEvent('connected', user);
					User.setConnected(true);
					auth.currentUser = user;
					// auth.connected = true;
					// User.setConnected(true)
					auth.resolve = user;
					if(!$rootScope.$$phase){

						$rootScope.$apply(function(){

						deferred.resolve(service)
						});		
						
					}
					// User.setProcessing(false);
					// console.log('connected');
					
				}
				else {
					deferred.resolve(service)
					// auth.connected = false;
					User.setConnected(false);
					auth.broadcastEvent('logout', error);
					auth.resolve = 'logout';


				}
				auth.broadcastEvent('done', service);

			});
			 User.setProcessing(false);
			 // if(!$scope.$$phase) $scope.$apply();
			return deferred.promise;
		},
		// login function
		login: function( type, user) {
			// login 
			console.log(user);
			User.setProcessing(true);
			if(type == "password") {
				auth.client.login(type, {
					email: user.uEmail,
					password: user.uPass
				})
			}
			else {
				auth.client.login(type)
			}
			
			
		},
		logout: function() {

			//User.setProcessing(true);
			auth.client.logout();
			// $location.path('/')
		},
		createUser: function(user) {

		User.setProcessing(true);
	
		// create user email password
		auth.client.createUser(user.Email, user.Pass, function(error, user ) {
				if(error) {
					auth.broadcastEvent('errorSignup', error)
				}
				else {
					auth.broadcastEvent('userCreated', user)
				}
			})
		},
	}

}]);
