var MANAGERS = [];
var LOGIN = false;

var app = angular.module('Index', ['ngSanitize']).controller('IndexController', ['$scope', '$http', '$interval', function($scope, $http, $interval){
    $scope.pictureList = [];
    $scope.displayPics = [];
    $scope.contentList = [];
    $scope.access = false;
    $scope.showAddress = false;
    $scope.adderess = "";

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

        $http.get('/getaddressonmain')
            .success(function(res){
                $scope.showAddress = res.addressOnMain;
                $scope.address = res.address;
                $scope.title = res.title;
            })
            .catch(function(err) {
                console.log('Get settings error.');
            });

        $http.get('/getshowpictures')
            .success(function(res){
                $scope.pictureList = res;
                $scope.loadCarousel();
                console.log('Pictures page loaded.');
            })
            .catch(function(err) {
                console.log('Get pictures error.');
            });

        $http.get('/getcontent')
            .success(function(res){
                $scope.contentList = res;
            })
            .catch(function(err) {
                console.log('Get contents error.');
            });
    };

    $scope.base64ToArrayBuffer = function(bin)
    {
        var length = bin.length;
        var buf = new ArrayBuffer(length);
        var arr = new Uint8Array(buf);
        for (var i = 0; i < length; i++) {
            arr[i] = bin.charCodeAt(i);
        }
        return buf;
    };

    $scope.loadCarousel = function()
    {
        $scope.picAmount = $scope.pictureList.length;
        if($scope.picAmount == 0)
            return;
        for(var i=0; i<$scope.pictureList.length; i++)
        {
            //console.log("This picture: ", $scope.pictureList[i]);
            var base64 = $scope.pictureList[i].data;
            var binary = $scope.base64ToArrayBuffer(atob(base64));
            var blob = new Blob([binary], {type: $scope.pictureList[i].contentType});
            var url = URL.createObjectURL(blob);
            $scope.displayPics[i] = {};
            /*$scope.displayPics[i] = function() {
             URL.revokeObjectURL(url);
             };*/
            $scope.displayPics[i].src = url;
            $scope.displayPics[i].title = $scope.pictureList[i].title;
            $scope.displayPics[i].desc = $scope.pictureList[i].desc;
        }
        console.log($scope.displayPics);
    };

    $scope.getSubArray = function()
    {
        return $scope.displayPics.slice(1, $scope.displayPics.length);
    };

    $interval(function(){
        $scope.access = LOGIN;
        localStorage.setItem("Access", $scope.access);
    }, 500);

    $scope.loadPanel();
}]);