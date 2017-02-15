var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('VideoGalleryCtrl', function ($scope, MyServices, $location, $ionicModal,
                                              $stateParams, $ionicLoading, $ionicPopup, $timeout, $ionicPlatform,
                                              $state, $rootScope, $window, VideosInfo, $localForage) {
        addanalytics("Video gallery detail page");
        // configreload.onallpage();
        $ionicLoading.show();
        $scope.pageno = 1;
        $scope.gallery = {};
        $scope.gallery.videos = [];
        $scope.keepscrolling = true;
        $scope.rotateVideo={};
        var devHeight = $window.innerHeight;
        var devWidth = $window.innerWidth;
        var categoryIndex = 0;


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
        console.log($stateParams.id);
        $scope.videoListImage = "http://business.staging.appturemarket.com/uploads/video-image/"+$stateParams.image;

        function fetchGalleryVideoData() {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });

            categoryIndex = _.findIndex(VideosInfo.data, function (n) {
                return n.id == $stateParams.id;
            })
            $scope.gallery = VideosInfo.data[categoryIndex];
            
            console.log(VideosInfo.data);
            console.log(categoryIndex);
            if (VideosInfo.data[categoryIndex].videos) {
                console.log('service contains the gallery');
                //binding local variable to service
                $scope.gallery.videos = VideosInfo.data[categoryIndex].videos;
                $ionicLoading.hide();
            }
            else {
                console.log('service does not contain the gallery');
                $localForage.getItem('videos').then(function (data) {
                    if (data != null) {
                        console.log('forage exists');
                        console.log(data);
                        var index = _.findIndex(data, function (n) {
                            return n.id == $stateParams.id;
                        })
                        if (index != -1 && data[index].photos) {
                            console.log('current gallery exists in forage');
                            $scope.gallery.videos = angular.copy(data[index].videos);
                            $ionicLoading.hide();
                        }
                        else {
                            console.log('current gallery no exist in forage');
                            $scope.loadVideos(1);
                        }
                    }
                    else {
                        console.log('forage no exists');
                        $scope.loadVideos(2);
                    }
                })
            }


        }


        $scope.loadVideos = function (index) {

            MyServices.getallvideogalleryvideo($scope.videoid, 1, function (data, status) {
                $ionicLoading.hide();
                $scope.gallery.videos = [];
                _.each(data.queryresult, function (n) {
                    n.publisheddate = new Date(n.publisheddate);
                    $scope.gallery.videos.push(n);
                });

                console.log($scope.gallery.videos);
                if (data.queryresult == '') {
                    $scope.keepscrolling = false;
                }

                if ($scope.gallery.videos.length == 0) {
                    $scope.msg = "The gallery is empty.";
                } else {
                    $scope.msg = "";
                }

                if (index == 1) {
                    $localForage.getItem('videos').then(function (forageData) {
                        console.log(forageData);
                        var forageIndex = _.findIndex(forageData, function (n) {
                            return n.id == $stateParams.id;
                        })
                        forageData[forageIndex].videos = $scope.gallery.videos;
                        $localForage.setItem('videos', forageData);
                        console.log('gallery saved in existing forage');
                    })

                }
                if (index == 2) {
                    var array = [];
                    array.push(VideosInfo.data[categoryIndex]);
                    $localForage.setItem('videos', array);
                    console.log('gallery saved in new forage');
                }
                $ionicLoading.hide();
                
            }, function (err) {
                $location.url("/access/offline");
            });
        }


        fetchGalleryVideoData();

        $scope.loadMorePolls = function () {
            $scope.loadVideos(++$scope.pageno);
        }


        var init = function () {
            return $ionicModal.fromTemplateUrl('templates/appView/modal-video.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;

            });
        };


        $scope.showVideo = function (url,orientation) {
            init().then(function () {
                $scope.modal.show();
            });
            $scope.video = [];
            $scope.video.url = url +'?showinfo=0';
            if(orientation=='2'){
                console.log('landscape');
                $scope.rotateVideo={'top':0+'px','width':devHeight+'px','height':devWidth+'px',
                'transform': 'translate('+(devWidth-devHeight)/2+'px,'+(devHeight-devWidth)/2+'px) rotate(90deg)'};
                $scope.landscape= true;
            }
            else{
                console.log('portrait');
                $scope.rotateVideo={};
                $scope.buttonRotate = {};
                $scope.landscape= false;
            }
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
        $scope.footerLink = function(links){
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
            if(links.name=="Phone Call"){
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
