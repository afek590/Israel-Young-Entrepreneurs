var app = angular.module('SettingsManage', []);

app.controller('SettingsController', ['$scope', '$http', '$window', function($scope, $http, $window)
{
    $scope.access = JSON.parse(localStorage.getItem("Access"));
    console.log($scope.access);
    if(!$scope.access)
        $window.location.href = "../";

    $scope.settings = {};
    $scope.settings.title = "";
    $scope.settings.address = "";
    $scope.settings.phone = "";
    $scope.settings.mail = "";
    $scope.settings.addressOnMain = false;

    $scope.disableTitle = true;
    $scope.disableAddr = true;
    $scope.disablePhn = true;
    $scope.disableMail = true;

    $scope.edit = function(id){
        $('#settingsTable').focus();
        if(id == "address")
        {
            $scope.disableAddr = false;
            $('#addressTxt').focus();
        }
        else if(id == "phone")
        {
            $scope.disablePhn = false;
            $('#phoneTxt').focus();
        }
        else if(id == "mail")
        {
            $scope.disableMail = false;
            $('#mailTxt').focus();
        }
        else if(id == "title")
        {
            $scope.disableTitle = false;
            $('#titleTxt').focus();
        }
    };

    $scope.updateSettings = function()
    {
        $http.post('/updatesettings', $scope.settings)
            .success(function(res) {
                swal({
                    title: "הגדרות האתר עודכנו",
                    type: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
                console.log('Settings updated.');
                $scope.loadPanel();
            })
            .catch(function(err) {
                console.log('Settings error updated.');
            });
    }

    $scope.loadPanel = function(){
        console.log('Panel has successfuly loaded.');
        $http.get('/getsettings')
            .success(function(res){
                if(res)
                    $scope.settings = res;
                console.log($scope.settings);
            })
            .catch(function(err) {
                console.log('Get contents error.');
            });
        $scope.disableTitle = true;
        $scope.disableAddr = true;
        $scope.disablePhn = true;
        $scope.disableMail = true;
    };

    $scope.loadPanel();
}]);