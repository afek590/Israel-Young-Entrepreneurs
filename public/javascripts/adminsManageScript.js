angular.module('AdminsManage', [])
    .controller('AdminsManageController', ['$scope', '$http', '$window', function($scope, $http, $window){
        $scope.access = JSON.parse(localStorage.getItem("Access"));
        console.log($scope.access);
        if(!$scope.access)
            $window.location.href = "../";

        $scope.adminObj = {};
        $scope.adminObj.name = "";
        $scope.adminObj.email = "";

        $scope.adminsList;

        $scope.loadPanel = function(){
            $http.get('/admins')
                .success(function(res){
                    $scope.adminsList = res;
                    console.log('Panel has successfuly loaded.');
                    $scope.$apply;
                })
                .catch(function(err) {
                    console.log('Get admins error.');
                });
        };

        $scope.addAdmin = function(){
            if(!$scope.access)
                return;
            $scope.adminObj.email = $scope.adminObj.email.toLowerCase();
            $http.post('/postadmin', $scope.adminObj)
                .success(function(res) {
                    $scope.adminObj.name = "";
                    $scope.adminObj.email = "";
                    console.log('Admin added successfully.');
                    $scope.loadPanel();
                })
                .catch(function(err) {
                    console.log('Admin add error.');
                });
        };

        $scope.delAdmin = function(admin){
            if(!$scope.access)
                return;
            if($scope.adminsList.length == 1)
            {
                alert('Can not delete the only admin.');
                return;
            }
            $http.post('/deladmin', admin)
                .success(function(res) {
                    console.log('Admin deleted successfuly.');
                    $scope.loadPanel();
                })
                .catch(function(err) {
                    console.log('Admin delete error.');
                });
        };

        $scope.loadPanel();
    }]);