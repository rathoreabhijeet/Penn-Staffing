var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('VideoGalleryCategoryCtrl', function ($scope, MyServices, $ionicLoading) {
        addanalytics("Video Gallery Page");
        ;
        $ionicLoading.show();
        $scope.videos = [];
        $scope.keepscrolling = true;
        $scope.pageno = 0;
        $scope.msg = "Loading....";
        // loader
        $scope.showloading = function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });
            $timeout(function () {
                $ionicLoading.hide();
            }, 5000);
        };
        $scope.loadphoto = function (pageno) {
            console.log('fetch');
            MyServices.getallvideogallery(pageno, function (data, status) {
                $ionicLoading.hide();
                console.log(data);
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
    })
