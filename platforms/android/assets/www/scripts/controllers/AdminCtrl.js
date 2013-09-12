DevpushApp_controllers.controller('AdminCtrl', ['$timeout', '$scope','AuthService', '$stateParams', 'angularFire', '$state', 'angulargmContainer',
  function ($timeout, $scope, auth, params, angularFire, $state, logged, angulargmContainer ) {
    
     $scope.points = [];
     $scope.icons = {
        red: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FE7569',
        gray: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|b2b2b2',
      }
      var ref = new Firebase('https://realtime-map.firebaseio.com/markers');
      angularFire(ref, $scope, "markers").then(function() {
        
        $scope.$watch("markers", function(connected) {
           $scope.$broadcast('gmMarkersRedraw', 'markers');
        })
      })
      
      $scope.getMarkerOptions = function(marker) {
          var opts = {name: marker.first_name};
          // console.log
          if(marker.connected) 
          {
            return angular.extend(opts, $scope.options.highlighted);
          } else {
            return angular.extend(opts, $scope.options.unhighlighted);
          }
      };

     $scope.options = {
        map: {
          center: new google.maps.LatLng(7.22, -4.12),
          zoom: 6,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        },
        marker: {
          clickable: false,
          draggable: false 
        },
        highlighted: {
          icon: $scope.icons.red
        },
        unhighlighted: {
          icon: $scope.icons.gray
        }
      };
      // tabs
      $scope.setCenter = function(lat ,lng) {
         
        $scope.center = new google.maps.LatLng(lat, lng);
      }
  
  
  }])
