var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('VideoGalleryCtrl', function ($scope, MyServices, $location, $ionicModal, $stateParams, $ionicLoading, $ionicPopup, $timeout, $ionicPlatform) {
        addanalytics("Video gallery detail page");
        configreload.onallpage();
        $ionicLoading.show();
        $scope.pageno = 1;
        $scope.videos = [];
        $scope.keepscrolling = true;
        $scope.msg = "Loading....";

        $scope.share = function (item) {
            console.log(item);
            window.plugins.socialsharing.share(item.alt, null, 'http://img.youtube.com/vi/' + item.url + '/default.jpg', 'https://www.youtube.com/watch?v=' + item.url);
        }

        $scope.showloading = function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });
            $timeout(function () {
                $ionicLoading.hide();
            }, 5000);
        };
        $scope.showloading();
        $scope.videoid = $stateParams.id;

        $scope.loadphoto = function (pageno) {
            MyServices.getallvideogalleryvideo($scope.videoid, pageno, function (data, status) {
                $ionicLoading.hide();
                _.each(data.queryresult, function (n) {
                    $scope.videos.push(n);
                });
                console.log($scope.videos);

                if (data.queryresult == '') {
                    $scope.keepscrolling = false;
                }

                if ($scope.videos.length == 0) {
                    $scope.msg = "The gallery is empty.";
                } else {
                    $scope.msg = "";
                }
            }, function (err) {
                $location.url("/access/offline");
            });

            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.$broadcast('scroll.refreshComplete');
        }


        $scope.loadphoto(1);

        $scope.loadMorePolls = function () {
            // $scope.loadphoto(++$scope.pageno);
        }


        var init = function () {
            return $ionicModal.fromTemplateUrl('templates/appView/modal-video.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;

            });
        };


        $scope.showVideo = function (url) {
            init().then(function () {
                $scope.modal.show();
            });
            $scope.video = [];
            $scope.video.url = url + "?autoplay=1";
        };

        $scope.closeVideo = function () {
            $scope.modal.remove()
                .then(function () {
                    $scope.modal = null;
                });
        };

        document.addEventListener('backbutton', function (event) {
            console.log("on back button");
            event.preventDefault(); // EDIT
            $scope.closeVideo();
            //		navigator.app.exitApp(); // exit the app
        });


        $ionicPlatform.onHardwareBackButton(function () {
            console.log("hardwarebutton");
            //		alert("back back");
            $scope.closeVideo();
            //		console.log("Back Button");
        });

        $scope.$on('modal.remove', function () {
            // Execute action
            console.log("on removed");
            $scope.currentURL = {};
        });

    })
