'use strict';

/* Controllers */

var app = angular.module('placeControllers', []);

// Allows url change with no redirect.
// From: http://joelsaupe.com/programming/angularjs-change-path-without-reloading/
app.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}])

// Main place controller - contains save and remove functions
app.controller('PlaceCtrl', ['$scope', '$routeParams', '$http', 'Places',
  function($scope, $routeParams, $http, Places) {
    // Initialise places to empty dictionary
    $scope.places = {};

    // Move to service (factory) and in controller at top depend on 
    $scope.save = function(place) {
      var placeSave = Places.save(place);

      placeSave.promise.success(function(data) {
        $scope.newEntry = placeSave.date;
        $scope.places[placeSave.date] = placeSave.place;
        $scope.date = null;
        $scope.place = null;
      });
    };

    $scope.remove = function(date) {
      var placeRemove = Places.remove(date);

      placeRemove.promise.success(function(data) {
        $scope.success = true;
        delete $scope.places[date];
      });
    };

    $scope.countPlaces = function () {
      return Object.keys($scope.places).length;
    }

    // Get all places
    Places.getAll().success(function(data) {
      $scope.places = data;
    });
  }]);

// Edit place controller
app.controller('PlaceEditCtrl', ['$scope', '$routeParams', '$http', '$location', 'Places',
  function($scope, $routeParams, $http, $location, Places) {
    var date = $routeParams.date;

    $scope.update = function(place) {
      var placeUpdate = Places.update(place, date);
      var newDate = placeUpdate.date;

      placeUpdate.promise.success(function(data) {
        $location.path("/place/"+newDate, false);
        $scope.success = true;
      });
    };

    Places.get(date).success(function(data) {
      $scope.place = {
        date: new Date(date),
        place: data
      };
    });
  }
]);