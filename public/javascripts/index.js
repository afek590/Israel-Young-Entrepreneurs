var MANAGERS = [];
var LOGIN = false;

var app = angular.module('Index', []).controller('IndexController', ['$scope', '$http', '$interval', function($scope, $http, $interval){
    $scope.loadPanel = function(){
        $http.get('/admins')
            .success(function(res){
                response = res;
                for(var i=0; i<response.length; i++)
                    MANAGERS.push(response[i].email);
                console.log('Panel has successfuly loaded.');
            })
            .catch(function(err) {
                console.log('Get admins error.');
            });
    };

    $scope.access = false;

    $interval(function(){
        $scope.access = LOGIN;
        localStorage.setItem("Access", $scope.access);
    }, 1000);

    $scope.loadPanel();
}]);