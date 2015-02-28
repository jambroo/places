'use strict';

/* Controllers */

var placeControllers = angular.module('placeControllers', []);

placeControllers.controller('PlaceCtrl', ['$scope', '$http',
  function($scope, $http) {
    $scope.save = function(place) {
      var yyyy = place.date.getFullYear().toString();
      var mm = (place.date.getMonth()+1).toString();
      var dd  = place.date.getDate().toString();
      var date = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);

      var place = place.place;

      $http.post('/api/place', {
        date: date,
        place: place
      }).success(function(data) {
        $scope.newEntry = date;
        $scope.places[date] = place;
        $scope.date = null;
        $scope.place = null;
      });
    };

    $http.get('/api/place').success(function(data) {
	    $scope.places = data;
	  });
  }]);
placeControllers.controller('PlaceEditCtrl', ['$scope', '$routeParams', '$http', '$location', 
  function($scope, $routeParams, $http, $location) {
    var date = $routeParams.date;
    // Could put update function here
    $scope.update = function(place) {
      var yyyy = place.date.getFullYear().toString();
      var mm = (place.date.getMonth()+1).toString();
      var dd  = place.date.getDate().toString();
      var newDate = yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);

      var place = place.place;

      $http.put('/api/place', {
        date: newDate,
        place: place,
        originalDate: date
      }).success(function(data) {
        $scope.success = true;
      });
    };

    var date = $routeParams.date;
    if (date.match(/^(\d{4})(\/|-)(\d{2})(\/|-)(\d{2})$/)) {
      $http.get('/api/place/'+date).success(function(data) {
        $scope.place = {
          date: new Date(date),
          place: data
        };
      });
    }
  }
]);