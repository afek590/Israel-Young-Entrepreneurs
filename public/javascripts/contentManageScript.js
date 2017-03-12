angular.module('ContentManage', ['ui.sortable']).controller('ContentManageController', ['$scope', '$http', '$window', function($scope, $http, $window)
{
    $scope.access = JSON.parse(localStorage.getItem("Access"));
    console.log($scope.access);
    if(!$scope.access)
        $window.location.href = "../";

    $scope.contentObj = {};
    $scope.contentObj.title = "";
    $scope.contentObj.description = "";
    $scope.contentObj.show =false;
    
    $scope.contentList = [];
    $scope.delObject;

    $scope.updObj={};
    $scope.updObj.title = "";
    $scope.updObj.description = "";
    $scope.updObj._id = "0";

    $scope.updObj.show = false;

    $scope.showUpdateContent = function(content){

        $scope.updObj.show = true;
        $scope.updObj.title = content.title;
        $scope.updObj.description =content.description;
        $scope.updObj._id=content._id;
        console.log($scope.updObj);
    };

    $scope.updateContent = function(){
        $scope.updObj.show = false;
        $http.post('/updatecontent', $scope.updObj)
            .success(function(res) {
                console.log('content updated.');
                $scope.loadPanel();

            })
            .catch(function(err) {
                console.log('content  error updated.');
            });
    };




    $scope.addContent = function(){
        $http.post('/postcontent', $scope.contentObj)
            .success(function(res) {
                $scope.contentObj.title = "";
                $scope.contentObj.description = "";
                console.log('content added successfully.');
                $scope.loadPanel();
            })
            .catch(function(err) {
                console.log('content add error.');
            });

    };

    $scope.delObj = function(content){
        $http.post('/delcontent', content)
            .success(function(res) {
                console.log('content remove.');
                $scope.loadPanel();
            })
            .catch(function(err) {
                console.log('content remove error.');
            });
    };

    $scope.loadPanel = function(){
        console.log('Panel has successfuly loaded.');
        $http.get('/getcontent')
            .success(function(res){
                $scope.contentList = res;
            })
            .catch(function(err) {
                console.log('Get contents error.');
            });
    };

    $scope.sortableOptions = {
        stop: function(e, ui) {
            $scope.contentList.map(function(element, index){
                element.index = index;
                $http.post('/updateindex', element)
                    .success(function(res) {
                        console.log('Index updated.');
                    })
                    .catch(function(err) {
                        console.log('Indexes update error.');
                    });
            });
        }
    };

    $scope.loadPanel();
}]);