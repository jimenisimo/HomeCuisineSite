angular.module('MyApp')
    .controller('MainCtrl', function($scope, Dish) {
        $scope.alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
            'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
            'Y', 'Z'];
        $scope.types = ['Mexican', 'Thai', 'German', 'Chinese', 'American'];
        $scope.headingTitle = 'Top 12 Dishes';
        $scope.dishes = Dish.query();
        $scope.filterByType = function(type) {
            $scope.dishes = Dish.query({ type: type });
            $scope.headingTitle = type;
        };
        $scope.filterByAlphabet = function(char) {
            $scope.dishes = Dish.query({ alphabet: char });
            $scope.headingTitle = char;
        };
    });