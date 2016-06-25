angular.module('MyApp')
  .factory('Dish', function($resource) {
    return $resource('/api/shows/:_id');
  });