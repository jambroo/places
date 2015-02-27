'use strict';

/* Controllers */

var placeControllers = angular.module('placeControllers', []);

placeControllers.controller('PlaceCtrl', ['$scope', '$http',
  function($scope, $http) {
    $http.get('/api/place').success(function(data) {
	    $scope.places = data;
	  });
  }]);
placeControllers.controller('PlaceEditCtrl', ['$scope', '$routeParams', '$http', 
  function($scope, $routeParams, $http) {
    var date = $routeParams.date;
    if (date.match(/^(\d{4})(\/|-)(\d{2})(\/|-)(\d{2})$/)) {
      $http.get('/api/place/'+date).success(function(data) {
        $scope.date = new Date(date);
        $scope.place = data;
      });
    }
  }
]);