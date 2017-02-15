var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('ProfileCtrl', function ($scope, MyServices, $location, $ionicLoading, $ionicPopup, $timeout, $cordovaFileTransfer, $cordovaImagePicker, $filter) {

        ;
        $scope.edit = false;
        $scope.user = {};
        $scope.user.newimage = "";
        $scope.password = {};
        //	$scope.user.dob = moment().format("YYYY-MM-DD");

        $scope.changeedit = function (val) {

            if ($.jStorage.get("user") && $.jStorage.get("user").dob)
                $scope.user.dob = new Date($.jStorage.get("user").dob);
            if (!_.isDate($scope.user.dob)) {
                $scope.user.dob = moment($scope.user.dob, "YYYY-MM-DD");
            }
            if (!_.isDate($scope.user.dob)) {
                $scope.user.dob = moment($scope.user.dob);
            }

            $scope.edit = val;
        }

        var showloading = function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });
            $timeout(function () {
                $ionicLoading.hide();
            }, 5000);
        };
        showloading();
        MyServices.getsingleuserdetail(function (data) {
            $ionicLoading.hide();
            $scope.user = data;
            addanalytics(data.name);
            $scope.user.newcoverimage = {
                'background-image': "url('" + $filter("serverimage")($scope.user.coverimage) + "')"
            };
            $scope.user.newimage = {
                'background-image': "url('" + $filter("profileimg")($scope.user.image) + "')"
            };

        }, function (err) {
            $location.url("/access/offline");
        });
        $scope.showPopup1 = function () {
            var myPopup = $ionicPopup.show({
                template: '<p class="text-center">Your profile is updated!</p>',
                title: 'Thank you!',
                scope: $scope,

            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 2000);
        };

        $scope.saveProfile = function () {
            MyServices.editprofile($scope.user, function (data, status) {
                if (data != 0) {
                    $.jStorage.set("user", data);
                    $scope.showPopup1();
                    $scope.edit = !$scope.edit;
                }
            }, function (err) {
                $location.url("/access/offline");
            })
        }

        $scope.passwordpopup = function (msg) {
            var myPopup = $ionicPopup.show({
                template: '<p class="text-center">' + msg + '</p>',
                title: 'Forgot Password!',
                scope: $scope,

            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 2000);
        };

        $scope.changePassword = function () {
            $scope.password.id = MyServices.getuser().id;


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
                MyServices.changepassword($scope.password, function (data) {
                    if (data == -1) {
                        $scope.passwordpopup("Both the passwords does not match");
                    } else if (data == 0) {
                        $scope.passwordpopup("Old password does not match");
                    } else {
                        $scope.passwordpopup("Password changed successfully");
                    }
                    console.log(data);
                }, function (err) {
                    $location.url("/access/offline");
                });
            } else {
                $ionicLoading.hide();
                $scope.passwordpopup("Please enter all the fields.");
            }


        }

        //	pick image from gallery
        var options = {
            maximumImagesCount: 1,
            width: 800,
            height: 800,
            quality: 80,
            allowEdit: true

        };
        $scope.picFromGallery = function () {
            $cordovaImagePicker.getPictures(options).then(function (resultImage) {
                $scope.user.newimage = {
                    'background-image': "url('" + resultImage[0] + "')"
                };
                $cordovaFileTransfer.upload(adminurl + "profileimageupload?id=" + MyServices.getuser().id, resultImage[0], {})
                    .then(function (result) {
                        var data = JSON.parse(result.response);
                        $ionicLoading.hide();
                    }, function (err) {
                    }, function (progress) {
                    });

            }, function (err) {
                // An error occured. Show a message to the user
            });
        };

        $scope.picImageForCover = function () {
            $cordovaImagePicker.getPictures(options).then(function (resultImage) {
                $scope.user.newcoverimage = {
                    'background-image': "url('" + resultImage[0] + "')"
                };
                $cordovaFileTransfer.upload(adminurl + "coverimageupload?id=" + MyServices.getuser().id, resultImage[0], {})
                    .then(function (result) {
                        var data = JSON.parse(result.response);
                        $ionicLoading.hide();
                    }, function (err) {
                    }, function (progress) {
                        ;
                    });
            }, function (err) {
                // An error occured. Show a message to the user
            });

        };
    })
