'use strict';
var app = angular.module('Video', [
    "ngSanitize",
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "com.2fdevs.videogular.plugins.overlayplay",
    "com.2fdevs.videogular.plugins.poster",
    "com.2fdevs.videogular.plugins.buffering"
]);
app.controller('VideoController', ['$scope', '$http', '$sce', '$timeout', function($scope, $http, $sce, $timeout){
    $scope.videoList = [];
    var controller = this;
    controller.state = null;
    controller.API = null;
    controller.currentVideo = 0;

    controller.onPlayerReady = function(API) {
        controller.API = API;
    };

    controller.onCompleteVideo = function() {
        controller.isCompleted = true;

        controller.currentVideo++;

        if (controller.currentVideo >= controller.videos.length) controller.currentVideo = 0;

        controller.setVideo(controller.currentVideo);
    };

    controller.videos = [
        {
            sources: [
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"},
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.webm"), type: "video/webm"},
                {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.ogg"), type: "video/ogg"}
            ]
        }
    ];

    controller.config = {
        preload: "none",
        autoHide: false,
        autoHideTime: 3000,
        autoPlay: false,
        sources: controller.videos[0].sources,
        theme: {
            url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
        },
        plugins: {
            poster: "http://www.videogular.com/assets/images/videogular.png"
        }
    };

    controller.setVideo = function(index) {
        controller.API.stop();
        controller.currentVideo = index;
        controller.config.sources = controller.videos[index].sources;
        $timeout(controller.API.play.bind(controller.API), 100);
    };

    $scope.loadPanel = function(){
        $scope.startCircle();
        $http.get('/getvideos')
            .success(function(res){
                $scope.videoList = res;
                $scope.loadVideos();
                console.log('Video page has successfuly loaded.');
                $scope.stopCircle();
            })
            .catch(function(err) {
                console.log('Get video error.');
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

    $scope.loadVideos = function(){
        for(var i=0; i<$scope.videoList.length; i++)
        {
            var videoObject = {};
            var sources = [];
            var video = {};
            var base64 = $scope.videoList[i].vid.data;
            var binary = $scope.base64ToArrayBuffer(atob(base64));
            var blob = new Blob([binary], {type: $scope.videoList[i].vid.contentType});
            var url = URL.createObjectURL(blob);
            video.src = $sce.trustAsResourceUrl(url);
            video.type = $scope.videoList[i].vid.contentType;
            sources.push(video);
            videoObject.sources = sources;
            controller.videos.push(videoObject);
        }
        console.log("Videos:", controller.videos);
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








