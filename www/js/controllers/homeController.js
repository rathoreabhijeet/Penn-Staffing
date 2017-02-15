var reloadpage = false;
var configreload = {};
angular.module('starter')

    .controller('HomeCtrl', function ($scope, $window, $location, MyServices, $ionicLoading, $timeout,
                                      $sce, $ionicSlideBoxDelegate, HomePageInfo) {
        addanalytics("Home page");
        var devHeight = $window.innerHeight;
        $scope.sliderheight = {'height': 0.6 * devHeight + 'px'};
        ;
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-positive"></ion-spinner>'
        });
        // var showloading = function () {
        //     $ionicLoading.show({
        //         template: '<ion-spinner class="spinner-positive"></ion-spinner>'
        //     });
        //     $timeout(function () {
        //         $ionicLoading.hide();
        //     }, 3000);
        // };
        // showloading();

        var loginstatus = false;
        var menu = {};
        menu.setting = false;

        $scope.content = {};
        if (_.isEmpty(HomePageInfo.content)) {
            MyServices.gethomecontent(function (data) {
                $scope.content = data;
                $scope.content.content = $sce.trustAsHtml($scope.content.content);
                HomePageInfo.content.content = $scope.content.content;
                //		$ionicLoading.hide();
            }, function (err) {
                // console.log('1');
                $location.url("/access/offline");
            });
        }
        else {
            $scope.content = HomePageInfo.content;
        }
        $scope.setup = function () {
            var blogdata = JSON.parse(MyServices.getconfigdata().config[0].text);
            _.each(blogdata, function (n) {
                if (n.value == true) {
                    loginstatus = true;
                }
            });
            if (loginstatus == false) {
                menu.setting = false;
                $.jStorage.deleteKey("user");
            } else {
                if (!MyServices.getuser() && MyServices.getuser() == null) {
                    $location.url("/access/login");
                    menu.setting = true;
                    //		$ionicLoading.hide();
                } else {
                    $ionicLoading.hide();
                }
            }
        }

        // MyServices.getallfrontmenu(function (data) {
        //     MyServices.setconfigdata(data);
        //     $scope.setup();
        // }, function (err) {
        //     // console.log('2');
        //     $location.url("/access/offline");
        // })

        if (HomePageInfo.data.length == 0) {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });
            MyServices.getallsliders(function (data) {

                // console.log('service empty')
                $scope.slides = data;
                _.each($scope.slides, function (n) {
                    n.fullImageLink = adminimage + n.image;
                })
                // console.log(data);
                $ionicSlideBoxDelegate.update();
                HomePageInfo.data = $scope.slides;
                $ionicLoading.hide();
            }, function (err) {
                // console.log('3');
                $location.url("/access/offline");
            });
        }
        else {
            // console.log('from service')
            $scope.slides = HomePageInfo.data;
            $ionicSlideBoxDelegate.update();
            $ionicLoading.hide();
        }


        // $scope.myActiveSlide = 0;

        // $scope.$watch(function (scope) {
        //         return $ionicSlideBoxDelegate.currentIndex()
        //     },
        //     function (newValue, oldValue) {
        //         switch (newValue) {
        //             case 0:
        //             case $ionicSlideBoxDelegate.slidesCount() - 1:
        //                 $ionicSlideBoxDelegate.enableSlide(false);
        //                 break;
        //         }
        //     }
        // );

        // $scope.enableSlideRight = function () {
        //     if ($ionicSlideBoxDelegate.currentIndex() == $ionicSlideBoxDelegate.slidesCount() - 1) {
        //         $ionicSlideBoxDelegate.enableSlide(true);
        //     }
        // }
        // $scope.enableSlideLeft = function () {
        //     if ($ionicSlideBoxDelegate.currentIndex() == 0) {
        //         $ionicSlideBoxDelegate.enableSlide(true);
        //     }
        // }
    })
