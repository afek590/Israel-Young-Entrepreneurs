angular.module('PanelManagement', [])
    .controller('PanelManagementController', ['$scope', '$http', '$window', function($scope, $http, $window){
        $scope.access = JSON.parse(localStorage.getItem("Access"));
        console.log($scope.access);
        if(!$scope.access)
            $window.location.href = "../";
    }]);