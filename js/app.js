'use strict';

var placeApp = angular.module('placeApp', [
  'ngRoute',
  'placeControllers'
]);

placeApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/places', {
        templateUrl: 'templates/place-list.html',
        controller: 'PlaceCtrl'
      }).
      when('/place/:date', {
        templateUrl: 'templates/place-edit.html',
        controller: 'PlaceEditCtrl'
      }).
      otherwise({
        redirectTo: '/places'
      });
  }]);