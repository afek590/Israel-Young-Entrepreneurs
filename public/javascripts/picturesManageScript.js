var app = angular.module('PicturesManage', ['ngFileUpload']);

app.controller('PicturesManageController', ['$scope', '$http', '$window', 'Upload', '$timeout', function($scope, $http, $window, Upload, $timeout)
    {
        $scope.access = JSON.parse(localStorage.getItem("Access"));
        console.log($scope.access);
        if(!$scope.access)
            $window.location.href = "../";
        $scope.pictureObj = {};
        $scope.pictureObj.title = "";
        $scope.pictureObj.description = "";
        $scope.pictureObj.show= false;


        $scope.pictureList;
        $scope.delObject;

        $scope.picturesUpObj={ };
        $scope.picturesUpObj.img = {};
        $scope.picturesUpObj.img.title = "";
        $scope.picturesUpObj.img.description = "";
        $scope.picturesUpObj.id = "0";
        $scope.picturesUpObj.show = false;

        $scope.file;
        $scope.showProgress = false;

        $scope.showUpdatePicture = function(pic){

            $scope.picturesUpObj.show = true;
            $scope.picturesUpObj.img.title = pic.img.title;
            $scope.picturesUpObj.img.description =pic.img.desc;
            $scope.picturesUpObj.id = pic._id;
        };

        $scope.updatePicture = function(){
            $scope.picturesUpObj.show = false;

            console.log('update has successfuly loaded.');
            $http.post('/updatepicture', $scope.picturesUpObj)
                .success(function(res) {
                    console.log('Picture updated.');
                    $scope.loadPanel();

                })
                .catch(function(err) {
                    console.log('Picture  error updated.');
                });
        };

        $scope.addPicture = function(file, errFiles){
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];
            $scope.showProgress = true;
        };

        $scope.sendPicture = function(){
            if ($scope.f)
            {
                $scope.f.upload = Upload.upload({
                    url: '/postpicture',
                    data: {file: $scope.f, title: $scope.pictureObj.title, desc: $scope.pictureObj.description}
                });

                $scope.f.upload.then(function (response) {
                    $timeout(function () {
                        $scope.f.result = response.data;
                        console.log(response);
                        if(response.data == 'no-support')
                            alert('File not supported.');
                        $scope.pictureObj.title = "";
                        $scope.pictureObj.description = "";
                        $scope.showProgress = false;
                        $scope.loadPanel();
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    $scope.f.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                });
            }
        };

        $scope.delObj = function(pic){
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
                    $scope.delObject= pic;
                    $http.post('/delPicture', $scope.delObject)
                        .success(function(res) {
                            console.log('Picture removed.');
                            swal({
                                title: "התמונה נמחקה",
                                type: "success",
                                showConfirmButton: false,
                                timer: 2000
                            });
                            $scope.loadPanel();
                        })
                        .catch(function(err) {
                            console.log('Picture remove error.');
                        });
                });
        };

        $scope.loadPanel = function(){
            $scope.startCircle();
            $http.get('/getpictures')
                .success(function(res){
                    $scope.pictureList = res;
                    console.log('Panel has successfuly loaded.');
                    $scope.stopCircle();
                })
                .catch(function(err) {
                    console.log('Get picture error.');
                });
        };

        $scope.startCircle = function(){
            document.getElementById("circle").classList.add("sk-circleSHOW1");
            document.getElementById("picturesTable").style.borderColor = "red";
        };

        $scope.stopCircle = function(){
            document.getElementById("circle").classList.remove("sk-circleSHOW1");
            document.getElementById("circle").classList.add("sk-circleSHOW");
            document.getElementById("picturesTable").style.borderColor = "green";
        };

        $scope.loadPanel();
    }]);