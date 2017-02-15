var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('PhotoGalleryCategoryCtrl', function ($scope, MyServices, $location, $ionicLoading,
                                                      $state, $rootScope, ImagesInfo, $localForage) {
        addanalytics("Photo gallery");
        // configreload.onallpage();
        $ionicLoading.show();
        $scope.msg = "Loading....";
        $scope.pageno = 1;
        // $scope.photos = [];
        $scope.keepscrolling = true;
        $scope.photos = ImagesInfo.data;
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


        // Fetch data from service OR local forage OR API
        function fetchImageData() {
            if (ImagesInfo.data.length == 0) {
                $ionicLoading.show({
                    template: '<ion-spinner class="spinner-positive"></ion-spinner>'
                });
                console.log('service empty');
                $localForage.getItem('images').then(function (data) {
                    if (data != null) {
                        console.log('forage exists');
                        console.log(data);
                        _.each(data,function(n){
                            $scope.photos.push(n);
                        })
                        $ionicLoading.hide();
                    }
                    else {
                        console.log('forage no exists');
                        loadgallery(1);
                    }
                })
            }
            else {
                console.log('service filled');
                $ionicLoading.hide();
            }
        }


        function loadgallery (pageno) {
            MyServices.getallgallery(pageno, function (data, status) {

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
                $localForage.setItem('images', $scope.photos);
                $ionicLoading.hide();

            }, function (err) {
                $location.url("/access/offline");
            });
        }

        $scope.loadMorePolls = function () {
            loadgallery(++$scope.pageno);
        }

        $scope.footerLink = function (links) {
            switch (links.linktype) {
                case '3':
                    links.typeid = links.event;
                    break;
                case '6':
                    links.typeid = links.gallery;
                    break;
                case '8':
                    links.typeid = links.video;
                    break;
                case '10':
                    links.typeid = links.blog;
                    break;
                case '2':
                    links.typeid = links.article;
                    break;
                default:
                    links.typeid = 0;

            }
            if (links.name == "Phone Call") {
                window.open('tel:' + ('+1' + $rootScope.phoneNumber), '_system');
            }
            else if (links.name == "Home") {
                $state.go("app." + $rootScope.homeLink);

            }
            else {
                $state.go("app." + links.linktypelink, {id: links.typeid, name: links.name});
            }
        }

        fetchImageData();

        $scope.refreshAllData = function () {
            $scope.photos.length = 0;
            loadgallery(1);
        }
    })
