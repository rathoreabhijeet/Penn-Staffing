var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('PhotoGalleryCtrl', function ($scope, MyServices, $window, $stateParams, $ionicLoading,
                                              $timeout, $state, $rootScope, $ionicModal, ImagesInfo, $localForage) {
        addanalytics("Photo gallery Details");
        // configreload.onallpage();
        var devH = $window.innerHeight;
        var devW = $window.innerWidth;
        $scope.imageInGallery = {'width': 0.32 * (devW - 18) + 'px', 'height': 0.32 * (devW - 18) + 'px'};
        $scope.fullDim = {'width': devW + 'px', 'height': devH + 'px'};

        $ionicLoading.show();
        $scope.keepscrolling = true;
        $scope.photos = [];
        $scope.pageno = 1;
        var categoryIndex = 0;
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

        function fetchGalleryImageData() {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });

            categoryIndex = _.findIndex(ImagesInfo.data, function (n) {
                return n.id == $stateParams.id;
            })
            $scope.gallery = ImagesInfo.data[categoryIndex];


            console.log(ImagesInfo.data);
            console.log(categoryIndex);
            if (ImagesInfo.data[categoryIndex].photos) {
                console.log('service contains the gallery');
                //binding local variable to service
                $scope.gallery.photos = ImagesInfo.data[categoryIndex].photos;
                $ionicLoading.hide();
            }
            else {
                console.log('service does not contain the gallery');
                $localForage.getItem('images').then(function (data) {
                    if (data != null) {
                        console.log('forage exists');
                        console.log(data);
                        var index = _.findIndex(data, function (n) {
                            return n.id == $stateParams.id;
                        })
                        if (index != -1 && data[index].photos) {
                            console.log('current gallery exists in forage');
                            $scope.gallery.photos = angular.copy(data[index].photos);
                            $ionicLoading.hide();
                        }
                        else {
                            console.log('current gallery no exist in forage');
                            $scope.loadgallery(1);
                        }
                    }
                    else {
                        console.log('forage no exists');
                        $scope.loadgallery(2);
                    }
                })
            }


        }

        $scope.loadgallery = function (index) {
            MyServices.getallgalleryimage($stateParams.id, 1, function (data, status) {
                console.log(data);
                $scope.gallery.photos = [];
                _.each(data.queryresult, function (n) {
                    $scope.photoObj = {};
                    $scope.photoObj.src = adminimage + n.src;
                    $scope.gallery.photos.push($scope.photoObj);
                });
                console.log($scope.gallery.photos);
                if (data.queryresult == '') {
                    $scope.keepscrolling = false;
                }

                if ($scope.gallery.photos.length == 0) {
                    $scope.msg = "The gallery is empty.";
                } else {
                    $scope.msg = "";
                }

                if (index == 1) {
                    $localForage.getItem('images').then(function (forageData) {
                        var forageIndex = _.findIndex(forageData, function (n) {
                            return n.id == $stateParams.id;
                        })
                        forageData[forageIndex].photos = $scope.gallery.photos;
                        $localForage.setItem('images', forageData);
                        console.log('gallery saved in existing forage');
                    })

                }
                if (index == 2) {
                    var array = [];
                    array.push(ImagesInfo.data[categoryIndex]);
                    $localForage.setItem('images', array);
                    console.log('gallery saved in new forage');
                }
                $ionicLoading.hide();

            }, function (err) {
                $location.url("/access/offline");
            });

        }

        fetchGalleryImageData();

        // $scope.loadMorePolls = function () {
        //     $scope.loadphoto(++$scope.pageno);
        // }

        $scope.openImageModal = function (image) {
            $scope.lightboxImage = image;
            $ionicModal.fromTemplateUrl('templates/lightbox.html', {
                scope: $scope,
                animation: 'fade-in-zoom'
            }).then(function (modal) {
                $scope.imageModal = modal;
                $scope.imageModal.show();
            });
        }

        $scope.closeImageModal = function () {
            $scope.imageModal.hide();
            $timeout(function () {
                $scope.imageModal.remove();
            }, 500)
        };

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


    })
