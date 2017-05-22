var app = angular.module('Contact', []);

app.controller('ContactController', ['$scope', '$http', function($scope, $http){
    $scope.settings = {};
    $scope.settings.title = "";
    $scope.showAddress = false;

    $scope.orginizationMail = "";

    $scope.mail = {};
    $scope.mail.name = "";
    $scope.mail.email = "";
    $scope.mail.phone = "";
    $scope.mail.text = "";

    $scope.loadPanel = function(){
        $http.get('/getsettings')
            .success(function(res){
                $scope.settings = res;
                console.log('Settings page loaded.');
                $scope.orginizationMail = $scope.settings.mail;
                $scope.showAddress = $scope.settings.addressOnMain;
                $scope.initMap($scope.setAddress, $scope.settings.address);
            })
            .catch(function(err) {
                console.log('Get settings error.');
            });
    };

    $scope.initMap = function(callback, address){
        // If adress is not supplied, use default value 'Ferrol, Galicia, Spain'
        address = address || 'Jerusalem, Israel';
        // Initialize the Geocoder
        geocoder = new google.maps.Geocoder();
        if (geocoder) {
            geocoder.geocode({
                'address': address
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    callback(results[0]);
                }
            });
        }
    };

    $scope.setAddress = function(googleObj) {
        var uluru = {lat: googleObj.geometry.location.lat(), lng: googleObj.geometry.location.lng()};
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: uluru
        });
        var marker = new google.maps.Marker({
            position: uluru,
            map: map
        });
    };

    $scope.sendMail = function(){
        if(!$scope.formValid())
            return;
        emailjs.send("gmail", "template_Ndz4pIZF", {"reply_to":$scope.orginizationMail,"from_name": $scope.mail.name,"to_name":"יזמים צעירים ישראל","message_html": $scope.mail.text, "phone": $scope.mail.phone, "email":$scope.mail.email});
        swal({
            title: "הפנייה נשלחה",
            type: "success",
            showConfirmButton: false,
            timer: 2000
        });
        $scope.mail.text = "";
        $scope.mail.name = "";
        $scope.mail.email = "";
        $scope.mail.phone = "";
    };

    $scope.formValid = function(){
        if($scope.mail.text === "" || $scope.mail.name === "" || $scope.mail.email === "")
        {
            swal({
                title: "עליך להזין שם, אימייל ותוכן פניה",
                type: "error",
                showConfirmButton: true
            });
            return false;
        }
        return true;
    };

    $scope.loadPanel();
}]);