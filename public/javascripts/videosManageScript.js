var app = angular.module('VideosManage', ['ngFileUpload']);

app.controller('VideosManageController', ['$scope', '$http', '$window', 'Upload', '$timeout', function($scope, $http, $window, Upload, $timeout)
    {
        $scope.access = JSON.parse(localStorage.getItem("Access"));
        console.log($scope.access);
        if(!$scope.access)
            $window.location.href = "../";

        $scope.videoObj = {};
        $scope.videoObj.name = "";
        $scope.videoObj.show=false;

        $scope.videoList;

        $scope.videoUpdateObj={ };
        $scope.videoUpdateObj.name = "";
        $scope.videoUpdateObj.id = "0";
        $scope.videoUpdateObj.show = false;


        $scope.file;
        $scope.showProgress = false;

        $scope.addVideo = function(file, errFiles){
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];
            $scope.showProgress = true;
        };

        $scope.sendVideo = function(){
            if ($scope.f)
            {
                $scope.f.upload = Upload.upload({
                    url: '/postvideo',
                    data: {file: $scope.f, name: $scope.videoObj.name}
                });

                $scope.f.upload.then(function (response) {
                    $timeout(function () {
                        $scope.f.result = response.data;
                        console.log(response);
                        if(response.data == 'no-support')
                            swal({
                                title: "העלאה נכשלה",
                                text: "העלאת הסרטון לשרת נכשלה, אנא נסה שנית מאוחר יותר",
                                type: "error"
                            });
                        $scope.videoObj.name = "";
                        $scope.showProgress = false;
                        $scope.loadPanel();
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    $scope.f.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                    console.log($scope.f.progress);
                });
            }
        };

        $scope.showUpdateVideo= function(video){

            $scope.videoUpdateObj.show = true;
            $scope.videoUpdateObj.name = video.vid.name;
            $scope.videoUpdateObj.id=video._id;
        };

        $scope.updateVideo = function(){
            $scope.videoUpdateObj.show = false;
            $http.post('/updatevideo', $scope.videoUpdateObj)
                .success(function(res) {
                    console.log('Video updated.');
                    $scope.loadPanel();
                })
                .catch(function(err) {
                    console.log('update Video error.');
                });
        };

        $scope.loadPanel = function(){
            $scope.startCircle();
            $http.get('/getvideos')
                .success(function(res){
                    $scope.videoList = res;
                    console.log('Panel has successfuly loaded.');
                    $scope.stopCircle();
                })
                .catch(function(err) {
                    console.log('Get Videos error.');
                    $scope.stopCircle();
                });
        };

        $scope.delVideo = function(video){
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
                    $http.post('/delvideo', video)
                        .success(function(res) {
                            console.log('Video deleted successfuly.');
                            swal({
                                title: "הסרטון נמחק",
                                type: "success",
                                showConfirmButton: false,
                                timer: 2000
                            });
                            $scope.loadPanel();
                        })
                        .catch(function(err) {
                            console.log(err);
                        });
                });
        };

        $scope.startCircle = function(){
            document.getElementById("circle").classList.add("sk-circleSHOW1");
        };

        $scope.stopCircle = function(){
            document.getElementById("circle").classList.remove("sk-circleSHOW1");
            document.getElementById("circle").classList.add("sk-circleSHOW");
        };

        $scope.loadPanel();
    }]);