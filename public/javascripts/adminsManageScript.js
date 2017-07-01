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
            if($scope.adminObj.email === "")
            {
                swal({
                    title: 'יש להזין כתובת אימייל',
                    type: 'error'
                });
                return;
            }
            if(!$scope.validateEmail($scope.adminObj.email))
            {
                swal({
                    title: 'כתובת האימייל לא תקינה',
                    type: 'error'
                });
                return;
            }
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
            if($scope.adminsList.length === 1)
            {
                swal({
                    title: 'לא ניתן למחוק את האדמין היחיד במערכת',
                    type: 'error'
                });
                return;
            }
            swal({
                    title: "האם את/ה בטוח?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "מחק",
                    cancelButtonText: "ביטול",
                    closeOnConfirm: false
                },
                function(){
                    $http.post('/deladmin', admin)
                        .success(function(res) {
                            console.log('Admin deleted successfuly.');
                            swal({
                                title: "האדמין הוסר",
                                type: "success",
                                showConfirmButton: false,
                                timer: 2000
                            });
                            $scope.loadPanel();
                        })
                        .catch(function(err) {
                            console.log('Admin delete error.');
                        });
                });
        };

        $scope.validateEmail = function(email)
        {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        };

        $scope.loadPanel();
    }]);