angular.module('Content', [])
    .controller('ContentController', ['$scope', '$http', function($scope, $http){
        $scope.contentList;

        $scope.loadContent = function()
        {
            $http.get('/content')
                .success(function(res){
                    $scope.contentList = res;

                })
                .catch(function(err) {
                    console.log('Get content error.');
                });
        };

        $scope.loadContent();
    }]);