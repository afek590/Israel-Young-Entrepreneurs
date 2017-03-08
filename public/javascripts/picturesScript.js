angular.module('Pictures', [])
    .controller('PicturesController', ['$scope', '$http', function($scope, $http){
        $scope.pictureList = [];
        $scope.displayPics = [];
        $scope.picAmount = 0;
        $scope.skipFirst = false;

        $scope.loadPictures = function(){
            $http.get('/getpictures')
                .success(function(res){
                    $scope.pictureList = res;
                    $scope.loadCarousel();
                    console.log('Pictures page loaded.');
                })
                .catch(function(err) {
                    console.log('Get pictures error.');
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
            //console.log("Picture list: ", $scope.pictureList);
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

        $scope.loadPictures();
    }]);
