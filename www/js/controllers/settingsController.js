var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('SettingCtrl', function ($scope, MyServices, $ionicLoading, $timeout, $location) {
        addanalytics("Setting page");
        ;
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-positive"></ion-spinner>'
        });
        $timeout(function () {
            $ionicLoading.hide();
        }, 5000);
        $scope.setting = {};
        MyServices.getsingleuserdetail(function (data) {
            $ionicLoading.hide();
            $scope.user = data;
            $scope.setting.videonotification = $scope.user.videonotification;
            $scope.setting.eventnotification = $scope.user.eventnotification;
            $scope.setting.blognotification = $scope.user.blognotification;
            $scope.setting.photonotification = $scope.user.photonotification;
            $scope.id = $scope.user.id;
        }, function (err) {
            $location.url("/access/offline");
        });

        $scope.changeSetting = function (setting) {
            setting.id = $scope.user.id;
            MyServices.changesetting(setting, function (data) {
                console.log(data);
            }, function (err) {
                $location.url("/access/offline");
            });
        }

    })
