angular.module('MyApp')
  .controller('AddCtrl', function($scope, $alert, Dish) {
    $scope.addDish = function() {
      Dish.save({ title: $scope.title,
                  type:  $scope.type,
                  description: $scope.description,
                  photo: $scope.photo}).$promise
        .then(function() {
          $scope.type = '';
          $scope.title = '';
          $scope.description = '';
          $scope.photo = '';
          $scope.addForm.$setPristine();
          $alert({
            content: 'Dish has been added.',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        })
        .catch(function(response) {
            $scope.type = '';
            $scope.title = '';
            $scope.description = '';
            $scope.photo = '';
            $scope.addForm.$setPristine();
          $alert({
            content: response.data.message,
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        });
    };
  });