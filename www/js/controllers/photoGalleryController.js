var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('PhotoGalleryCtrl', function ($scope, MyServices, $stateParams, $ionicLoading, $timeout) {
        addanalytics("Photo gallery Details");
        ;
        $ionicLoading.show();
        $scope.msg = "Loading....";
        $scope.keepscrolling = true;
        $scope.photos = [];
        $scope.pageno = 1;
        // loader

        $scope.showloading = function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });
            $timeout(function () {
                $ionicLoading.hide();
            }, 5000);
        };

        $scope.showloading();

        $scope.photoid = $stateParams.id;

        $scope.loadphoto = function (pageno) {
            MyServices.getallgalleryimage($stateParams.id, pageno, function (data, status) {
                $ionicLoading.hide();
                _.each(data.queryresult, function (n) {
                    $scope.photoObj = {};
                    $scope.photoObj.src = adminimage + n.src;
                    $scope.photos.push($scope.photoObj);
                });
                if (data.queryresult == '') {
                    $scope.keepscrolling = false;
                }

                if ($scope.photos.length == 0) {
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
            $scope.loadphoto(++$scope.pageno);
        }

    })
