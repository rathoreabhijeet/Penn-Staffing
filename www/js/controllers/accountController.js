var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('AccountCtrl', function ($scope, MyServices, $location, $ionicLoading, $ionicPopup, $timeout) {
        addanalytics("Account page");
        if ($.jStorage.get("user")) {
            $scope.userdetails = {};
            $scope.userdetails.username = $.jStorage.get("user").username;
            if ($scope.userdetails.username == "") {
                $scope.userdetails.username = $.jStorage.get("user").name;
            }
            $scope.userdetails.userimage = $.jStorage.get("user").image;
            $scope.userdetails.useremail = $.jStorage.get("user").email;
        }

        $scope.showloading = function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });
            $timeout(function () {
                $ionicLoading.hide();
            }, 5000);
        };
        $scope.profile = {};
        $scope.showPopup1 = function () {

            var myPopup = $ionicPopup.show({
                template: '<p class="text-center">Your profile is created!</p>',
                title: 'Thank you!',
                scope: $scope,
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 2000);
        };

        var profilesubmitcallback = function (data, status) {
            $ionicLoading.hide();
            if (data == 1) {
                $scope.showPopup1();
                $scope.profile = {};
            }
        }

        $scope.profilesubmit = function (profile) {
            $ionicLoading.show();
            MyServices.profilesubmit(profile, profilesubmitcallback, function (err) {
                $location.url("/access/offline");
            })
        }
    })
