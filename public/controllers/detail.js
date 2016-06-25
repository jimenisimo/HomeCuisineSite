angular.module('MyApp')
  .controller('DetailCtrl', function($scope, Dish) {
      Dish.get({ title: $routeParams.id }, function(dish) {
        $scope.dish = dish;

      });
    });