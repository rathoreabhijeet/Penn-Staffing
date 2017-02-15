var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('PhotoGalleryCategoryCtrl', function ($scope, MyServices, $location, $ionicLoading) {
        addanalytics("Photo gallery");
        configreload.onallpage();
        $ionicLoading.show();
        $scope.msg = "Loading....";
        $scope.pageno = 1;
        $scope.photos = [];
        $scope.keepscrolling = true;
        $scope.showloading = function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });
            $timeout(function () {
                $ionicLoading.hide();
            }, 5000);
        };

        $scope.sendphotoid = function (id) {
            $location.url("app/photogallery/" + id);
        }

        $scope.loadgallery = function (pageno) {
            MyServices.getallgallery(pageno, function (data, status) {
                $ionicLoading.hide();

                _.each(data.queryresult, function (n) {
                    $scope.photos.push(n);
                });

                if (data.queryresult == '') {
                    $scope.keepscrolling = false;
                }

                if ($scope.photos.length == 0) {
                    $scope.msg = "The gallery is empty.";
                } else {
                    $scope.msg = "";
                }
                console.log($scope.photos);
            }, function (err) {
                $location.url("/access/offline");
            });

            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.$broadcast('scroll.refreshComplete');
        }

        $scope.loadgallery(1);

        $scope.loadMorePolls = function () {
            $scope.loadgallery(++$scope.pageno);
        }

    })
