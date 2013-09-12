'use strict';

var DevpushApp_directives = angular.module('DevpushApp.directives', ['DevpushApp.services']);

DevpushApp_directives.directive('header', function() {
		return {
			restrict: 'E',
			templateUrl: 'views/header.html',
			// link: function() {
				
			// }
		}
	})

DevpushApp_directives.directive('footer', function() {
	return {
		restrict: 'E',
		templateUrl: 'views/footer.html',
	//	replace: true
	}
})

DevpushApp_directives.directive('repeatpassword', function(){
	return {
		require: 'ngModel',
		restrict: 'A',
		replace: true,
		// template: '<input type="text" >',
		link: function (scope, element, attrs, ctrl) {
			// body.....
			 //console.log(element.inheritedData("$SignsCtrl"));
			var otherInput = scope.signupForm[attrs.repeatpassword]
			// ctrl.$setValidity("repeat", false)
			ctrl.$parsers.push(function(value) {
				// if is valid
				// console.log(value === otherInput.$viewValue);
				ctrl.$setValidity("repeat", value === otherInput.$viewValue);
				return value;
			})

			otherInput.$parsers.push(function(value) {
				// body...
				ctrl.$setValidity("repeat", value === ctrl.$viewValue)
				otherInput.$setValidity("length", value.length >= 5);
				return value;
			})
		}
	}
})

DevpushApp_directives.directive('logged',  ['$rootScope', 'AuthService', function(scope,auth){
	// Runs during compile
	return {
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		link: function($scope, iElm, iAttrs) {
			$scope.user = auth.getUserData();
			$scope.$watch('user.connected', function(notlogged) {
				// console.log(auth.getUserData());
				// console.log(newValue)
				if(notlogged) {
					iElm.removeClass('hide')
				}
				else {
					iElm.addClass('hide')
				}
			});

		}

	};
}]);

DevpushApp_directives.directive('notlogged',  ['$rootScope', 'AuthService', function(scope,auth){
	// Runs during compile
	return {
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		link: function($scope, iElm, iAttrs) {
			auth.getUserData()
			$scope.$watch('user.connected', function(logged) {
				// console.log(auth.getUserData());
				// console.log(newValue)
				if(logged) {
					iElm.addClass('hide')
				}
				else {
					iElm.removeClass('hide')
				}
			});


		}

	};
}]);

DevpushApp_directives.directive('processing', ['$rootScope', 'AuthService', function(scope, auth) {
	return {
		restrict: 'A',
		link: function($scope, iElm, iAttrs) {
				$scope.user = auth.getUserData();
				// console.log(scope.user);
				// console.log(auth.getUserData())
				scope.$watch('user.processing', function(newValue, oldValue, scope) {
					// console.log(auth.getUserData());
					// console.log(auth.getUserData().processing)

					if(newValue) {

						iElm.addClass('processing')
					}
					else {
						iElm.removeClass('processing')
					}
				});

				iElm.bind('click', function(){
					angular.element(document.querySelector('#user-nav')).addClass('hide')
				});


			}
	}
}])

DevpushApp_directives.directive('dropdown', ['$rootScope', 'AuthService', function(scope, auth) {
	return {
		restrict: 'A',
		link: function($scope, iElm, iAttrs) {
				iElm.parent().bind('click', function(e){
					iElm.toggleClass('hide');
					e.stopPropagation();
				});


			}
	}
}])

DevpushApp_directives.directive('logevent', ['$rootScope', 'AuthService', '$state' , function($rootScope, auth, $state) {
	return {
		restrict: 'E',
		// replace: true,.
		// <li class="nav-icon" aria-hidden="true" data-icon="&#xe006;">
		template: '<div ng-init="errorshow = null" ng-class="logclass" class="message" aria-hidden="true" data-icon="&#xe00c;" ng-click="errorshow = false" ng-show="errorshow"><span  class="">{{logevent}}</span></div>',
		link: function($scope, iElm, iAttrs) {
			// console.log($state)
			
			 $rootScope.$on("$stateChangeStart", function() {
			 	// $scope.errorshow = false;
			 })
			$rootScope.$on('logevent', function(event, log) {
				// show error
				$scope.errorshow = true;
				// console.log(log)
				$scope.logclass = log.type
				$scope.logevent = log.message;
		   		// console.log('asdf')
		   		// $scope.$apply();
		  });
		}
	}
}])


DevpushApp_directives.directive('googleplace', ['$timeout', function($timeout) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                // types: ['(' + attrs.googleplace + ')'],
                componentRestrictions: {country: 'ci'}
            };
            // console.log(options)
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                	// console.log()
                    model.$setViewValue(element.val()); 
                     // console.log(scope.gPlace.getPlace);
                    // console.log(scope.gPlace.getPlace().geometry.location);  
                    if(scope.gPlace.getPlace().geometry)
                     {
                     	// the async way
                    	 scope.location = scope.gPlace.getPlace().geometry.location;  
                    	 $timeout(function() { 
	                  		  scope.setAddress(scope.location)
	             		 }, 10)
                		// scope.$emit("mapclicke", scope.location)
	                    // scope.setCenter(scope.location)
                    }  
                });
            });
        }
    };
}]);