var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('ResetPasswordCtrl', function ($scope) {
        addanalytics("Reset password");
        // loader
        $scope.showloading = function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });
            $timeout(function () {
                $ionicLoading.hide();
            }, 5000);
        };

        $scope.showPopup2 = function () {
            var myPopup = $ionicPopup.show({
                template: '<p class="text-center">Your password is updated!</p>',
                title: 'Password updated!',
                scope: $scope,

            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 2000);
        };

        $scope.showPopup3 = function () {

            var myPopup = $ionicPopup.show({
                template: '<p class="text-center">Your passwords do not match!</p>',
                title: 'Sorry!',
                scope: $scope,

            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 2000);
        };

        $scope.showPopup4 = function () {

            var myPopup = $ionicPopup.show({
                template: '<p class="text-center">Something went wrong!</p>',
                title: 'Oops! Try again.',
                scope: $scope,

            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 2000);
        };

        $scope.password = {};
        var changepasswordcallback = function (data, status) {
            if (data == 1) {
                $scope.showPopup2();
                $ionicLoading.hide();
                $scope.password = {};
            } else if (data == 0) {
                $ionicLoading.hide();
                $scope.showPopup4();
            } else if (data == -1) {
                $ionicLoading.hide();
                $scope.showPopup3();
            }
        }

        $scope.changepassword = function (password) {
            $ionicLoading.show();

            $ionicLoading.show();
            $scope.allvalidation = [{
                field: $scope.password.oldpassword,
                validation: ""
            }, {
                field: $scope.password.newpassword,
                validation: ""
            }, {
                field: $scope.password.confirmpassword,
                validation: ""
            }];
            var check = formvalidation($scope.allvalidation);
            if (check) {
                MyServices.changepassword(password, changepasswordcallback, function (err) {
                    $location.url("/access/offline");
                });
            } else {
                msgforall("Fill all data");
                $ionicLoading.hide();
            }

        }

    })
