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


        $scope.pictureList;
        $scope.delObject;

        $scope.picturesUpObj={ };
        $scope.picturesUpObj.title = "";
        $scope.picturesUpObj.description = "";
        $scope.picturesUpObj.id = "0";
        $scope.picturesUpObj.show = false;

        $scope.file;
        $scope.showProgress = false;

        $scope.showUpdatePicture = function(pic){

            $scope.picturesUpObj.show = true;
            $scope.picturesUpObj.title = pic.title;
            $scope.picturesUpObj.description =pic.desc;
            $scope.picturesUpObj.id = pic._id;
        };

        $scope.updatePicture = function(){
            $scope.picturesUpObj.show = false;

            console.log('update has successfuly loaded.');
            $http.post('/updatepicture', $scope.picturesUpObj)
                .success(function(res) {
                    console.log('Picture updated.');
                    swal({
                        title: "התמונה עודכנה",
                        type: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
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
                    data: {file: $scope.f, title: $scope.pictureObj.title, desc: $scope.pictureObj.description, show: false}
                });

                $scope.f.upload.then(function (response) {
                    $timeout(function () {
                        $scope.f.result = response.data;
                        console.log(response);
                        if(response.data == 'no-support')
                            swal({
                                title: "העלאה נכשלה",
                                text: "הקובץ איננו נתמך",
                                type: "error"
                            });
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
            $http.get('/getnodatapictures')
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
        };

        $scope.stopCircle = function(){
            document.getElementById("circle").classList.remove("sk-circleSHOW1");
            document.getElementById("circle").classList.add("sk-circleSHOW");
        };

        $scope.changeShow = function(pic)
        {
            $http.post('/updateshow', pic)
                .success(function(res) {
                    console.log('Show updated.');
                    $scope.loadPanel();

                })
                .catch(function(err) {
                    console.log('Show  error updated.');
                });
            if(pic.show)
                swal({
                    title: "התמונה נוספה לדף הבית",
                    type: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
            else
                swal({
                    title: "התמונה הוסרה מדף הבית",
                    type: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
        };

        $scope.loadPanel();
    }]);