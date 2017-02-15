var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('ForgotPasswordCtrl', function ($scope, $ionicLoading, $timeout, MyServices, $location, $ionicPopup) {
        addanalytics("Forgot password");
        // loader
        $scope.showloading = function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });
            $timeout(function () {
                $ionicLoading.hide();
            }, 5000);
        };
        var forgotpasswordcallback = function (data, status) {
            console.log(data);
            $ionicLoading.hide();
            if (data == "true") {
                var myPopup = $ionicPopup.show({
                    template: '<p class="text-center">Please check your email, an email has been send to your id.</p>',
                    title: 'Email sent!',
                    scope: $scope,

                });
                $timeout(function () {
                    myPopup.close(); //close the popup after 3 seconds for some reason
                    $location.url("/access/login");
                }, 2000);

            } else {
                var myPopup = $ionicPopup.show({
                    template: '<p class="text-center">Not a valid email.</p>',
                    title: 'Oops! Try again.',
                    scope: $scope,

                });
                $timeout(function () {
                    myPopup.close(); //close the popup after 3 seconds for some reason
                }, 2000);
            }
        }
        $scope.forgotpassword = function (email) {
            $ionicLoading.show();
            MyServices.forgotpassword(email, forgotpasswordcallback, function (err) {
                $location.url("/access/offline");
            });
        }
    })
