'use strict';

/* Services / Factories */

app.factory('Places', ['$http',
  function($http) {
    var _getDateStr = function(date) {
      var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth()+1).toString();
      var dd  = date.getDate().toString();
      
      return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
    };

    var _save = function(place) {
      var date = _getDateStr(place.date);
      var place = place.place;

      var promise = $http.post('/api/place', {
        date: date,
        place: place
      });

      return {
        date: date,
        place: place,
        promise: promise
      }
    };

    var _update = function(place, originalDate) {
      var date = _getDateStr(place.date);
      var place = place.place;

      var promise = $http.put('/api/place', {
        date: date,
        place: place,
        originalDate: originalDate
      });

      return {
        date: date,
        place: place,
        promise: promise
      }
    };

    var _remove = function(date) {
      var promise = $http.delete('/api/place', {data: date});

      return {
        date: date,
        promise: promise
      }
    };

    var _getAll = function () {
      return $http.get('/api/place');
    };

    var _get = function(date) { 
      return $http.get('/api/place/'+date);
    }

    return {
      get: _get,
      getAll: _getAll,
      save: _save,
      update: _update,
      remove: _remove
     };
   }
 ]
);