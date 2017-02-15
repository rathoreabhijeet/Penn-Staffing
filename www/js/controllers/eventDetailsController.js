var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('EventDetailCtrl', function ($scope, $stateParams, MyServices, $location, $ionicLoading, $ionicSlideBoxDelegate, $ionicModal) {
        ;
        // $scope.showloading = function () {
        //     $ionicLoading.show({
        //         template: '<ion-spinner class="spinner-positive"></ion-spinner>'
        //     });
        //     $timeout(function () {
        //         $ionicLoading.hide();
        //     }, 5000);
        // };

        $scope.msg = "Loading...";
        $scope.video = {};
        $scope.image = {};


        var init = function () {
            return $ionicModal.fromTemplateUrl('templates/appView/modal-video.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;

            });
        };

        $ionicModal.fromTemplateUrl('templates/appView/modal-image.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;

        });

        $scope.showVideo = function (url) {
            console.log(url);
            init().then(function () {
                $scope.modal.show();
            });
            $scope.video.url = url + "?autoplay=1";
        };
        $scope.showImage = function (url) {
            $scope.modal.show();
            $scope.image.img = url;
        };

        $scope.closeVideo = function () {
            $scope.modal.remove()
                .then(function () {
                    $scope.modal = null;
                });
        };
        $scope.closeImage = function () {
            $scope.modal.hide();
        };

        $scope.id = $stateParams.id;
        var getsingleeventscallback = function (data, status) {
            if (data == "") {
                $scope.msg = "No data found";
                addanalytics("Event detail page");
            } else {
                $scope.msg = "";
                addanalytics(data.title);
            }
            if (data.eventimages && data.eventimages.length > 0) {
                data.eventimages = _.chunk(data.eventimages, 2);
            }
            if (data.eventvideos && data.eventvideos.length > 0) {
                data.eventvideos = _.chunk(data.eventvideos, 2);
            }
            $scope.eventdetail = data;
            $ionicSlideBoxDelegate.update();
        }
        MyServices.getsingleevents($stateParams.id, getsingleeventscallback, function (err) {
            $location.url("/access/offline");
        })
    })
