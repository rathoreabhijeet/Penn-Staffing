var reloadpage = false;
var configreload = {};
angular.module('starter')

    .controller('Home99Ctrl', function ($scope, $window, $location, MyServices, $ionicLoading, $timeout,
                                        $sce, $ionicSlideBoxDelegate, HomePage5Info, RSS, $rootScope, $q,
                                        $http, $state, Banner, HeaderLogo, Footer, $localForage, Config,
                                        $stateParams, $cordovaToast,MenuData) {

        // ------------------------------ I N I T I A L I Z E -----------------------------

        var devH = $window.innerHeight;
        var devW = $window.innerWidth;
        $scope.sliderheight = {'max-height': 0.44 * devH + 'px', 'height': 0.44 * devH + 'px', 'width': devW + 'px'};
        $scope.fullDim = {'height': devH + 'px', 'width': devW + 'px'};
        $scope.RSSCat = {'min-height': devW / 2 + 'px'};
        $scope.promo_banner = {'max-height': 0.15 * devH + 'px', 'height': 0.15 * devH + 'px', 'width': devW + 'px'};
        $scope.visibleRSS = {'height': (0.41 * devH) - 44 - 50 + 'px'};
        $scope.menudata = MenuData.data;
        console.log($scope.menudata);
        $scope.menuLoading = true;
        $scope.slider1Loading = true;
        $scope.slider2Loading = true;
        $scope.RSSLoading = true;

        var loginstatus = false;
        var menu = {};
        menu.setting = false;

        $scope.slides = HomePage5Info.data;
        $scope.banners = HomePage5Info.promos;

        var promises = [];
        $scope.RSS = RSS.data;
        $scope.categories = RSS.categories;
        var categories = [];

        // ------------------------------ D I R E C T  A P I  C A L L S -----------------------------


        Footer.getfooterlinks().then(function (data) {
            // console.log(data);
            $rootScope.footerLinks = data;
        })

        // HEADER LOGO - BUSINESS IMAGE
        HeaderLogo.getheaderlogo().then(function (data) {
                // console.log(data);
                // $scope.headerLogo = "http://business.staging.appturemarket.com/uploads/header-logo/"+data;
            },
            function (err) {
                console.log(err);
            })


        // ------------------------------ I N N E R  F U N C T I O N S -----------------------------

        //Checks for URL in page title, for RSS feed
        function isURL(s) {
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            return regexp.test(s);
        }

        // MAIN SLIDER
        function loadMainSlider() {
            $scope.slider1Loading = true;
            if (HomePage5Info.data.length == 0) {
                // console.log('service empty');
                $localForage.getItem('mainSlider').then(function (forageData) {
                    // console.log(forageData);
                    if (forageData != null) {
                        // console.log('forage exists');
                        $scope.slides = angular.copy(forageData);
                        $scope.slider1Loading = false;
                        // $timeout(function() {
                        //     $ionicSlideBoxDelegate.$getByHandle('slides').update();
                        // },50);
                    }
                    else {
                        // console.log('no forage');
                        fetchInnerSliders();
                    }
                });
            }
            else {
                // console.log('from service')
                $scope.slider1Loading = false;
                // $timeout(function() {
                //     $ionicSlideBoxDelegate.$getByHandle('slides').update();
                // },50)
            }
        }

        // PROMOS SLIDER
        function loadPromoSlider() {
            $scope.slider2Loading = true;
            if (HomePage5Info.promos.length == 0) {
                $localForage.getItem('promoSlider').then(function (forageData) {
                    if (forageData != null) {
                        _.each(forageData, function (n) {
                            $scope.banners.push(n);
                        })
                        $scope.slider2Loading = false;
                        // $timeout(function() {
                        //     $ionicSlideBoxDelegate.$getByHandle('promotion').update();
                        // },50);
                    }
                    else {
                        fetchPromoSliders();
                    }
                });
            }
            else {
                // console.log('from service')
                $scope.slider2Loading = false;
                // $timeout(function(){
                //     $ionicSlideBoxDelegate.$getByHandle('promotion').update();
                // },50)
            }
        }

        //RSS DATA
        function loadRSS() {
            //RSS data stored in service and fetched only if service is empty
            $scope.RSSLoading = true;
            if (RSS.data.length == 0) {
                // console.log('RSS service empty');
                $scope.RSS.length = 0;
                $localForage.getItem('rssData').then(function (forageData) {
                    console.log(forageData);
                    if (forageData != null) {
                        _.each(forageData, function (n) {
                            $scope.RSS.push(n);
                        });
                        $scope.RSSLoading = false;
                    }
                    else {
                        console.log('from loadrss');
                        fetchRSSData();
                    }
                });
            }
            else {
                $ionicLoading.hide();
                $scope.RSSLoading = false;
                console.log('RSS service filled');
            }
        }


        function fetchInnerSliders() {
            //Home slider images data stored in service and fetched only if service is empty
            MyServices.getallsliders(function (data) {

                // console.log(data);
                $scope.slides = angular.copy(data);
                // _.each($scope.slides.menu, function (n) {
                //     n.fullImageLink = adminimage + n.image;
                // })
                // console.log($scope.slides);

                _.each($scope.slides.menu, function (n) {
                    switch (n.linktype) {
                        case '3':
                            n.typeid = n.event;
                            break;
                        case '6':
                            n.typeid = n.gallery;
                            break;
                        case '8':
                            n.typeid = n.video;
                            break;
                        case '10':
                            n.typeid = n.blog;
                            break;
                        case '2':
                            n.typeid = n.article;
                            break;
                        default:
                            n.typeid = 0;
                    }
                    if (n.linktypelink == 'home') {
                        n.linktypelink = $rootScope.thisIsHome;
                    }
                })

                // console.log($scope.slides);
                $localForage.setItem('mainSlider', $scope.slides);
                // console.log('slides saved in forage');
                $scope.slider1Loading = false;
                // $timeout(function() {
                //     $ionicSlideBoxDelegate.$getByHandle('slides').update();
                // },50);
            }, function (err) {
                $location.url("/access/offline");
            });
        }

        function fetchPromoSliders() {
            //Promos slider images data stored in service and fetched only if service is empty
            Banner.getAllPromotions().then(function (data) {
                _.each(data, function (n) {
                    $scope.banners.push(n);
                })
                _.each($scope.banners, function (n) {
                    switch (n.linktype) {
                        case '3':
                            n.typeid = n.event;
                            break;
                        case '6':
                            n.typeid = n.gallery;
                            break;
                        case '8':
                            n.typeid = n.video;
                            break;
                        case '10':
                            n.typeid = n.blog;
                            break;
                        case '2':
                            n.typeid = n.article;
                            break;
                        default:
                            n.typeid = 0;
                    }
                    if (n.linktypelink == 'home') {
                        n.linktypelink = $rootScope.thisIsHome;
                    }
                })
                // console.log($scope.banners);
                $localForage.setItem('promoSlider', $scope.banners);
                $scope.slider2Loading = false;
                // $timeout(function() {
                //     $ionicSlideBoxDelegate.$getByHandle('promotion').update();
                // },50);

            });
        }

        function sortRssLinks(data) {
            // $scope.menudata.length=0;

            // console.log(data);
            _.each(data.menu, function (n, index) {
                if (n.linktypelink != "setting" && n.linktypelink != "contact" && n.linktypelink != "profile") {
                    var newmenu = {};
                    newmenu.id = n.id;
                    newmenu.name = n.name;

                    newmenu.order = n.order;
                    newmenu.icon = n.icon;
                    newmenu.link_type = n.linktypename;
                    newmenu.articlename = n.articlename;
                    switch (n.linktype) {
                        case '3':
                            newmenu.typeid = n.event;
                            break;
                        case '6':
                            newmenu.typeid = n.gallery;
                            break;
                        case '8':
                            newmenu.typeid = n.video;
                            break;
                        case '10':
                            newmenu.typeid = n.blog;
                            break;
                        case '2':
                            newmenu.typeid = n.article;
                            break;
                        default:
                            newmenu.typeid = 0;
                    }
                    newmenu.link = n.linktypelink;
                    // $rootScope.homeName = 'Home';

                    //If there is URL in page name, it means it contains RSS feed links
                    if (n.linktypename == "Pages" && isURL(n.articlename)) {
                        $rootScope.RSSarray.push(newmenu);
                    }
                    // console.log($rootScope.RSSarray);
                }
            });
            console.log('from sortlinks');
            fetchRSSData();
        }

        function fetchConfigData() {
            MyServices.getallfrontmenu(function (data) {
                MyServices.setconfigdata(data);
                Config.data = data;
                console.log(data);
                $localForage.setItem('config', data);

                sortRssLinks(data);
            }, function (err) {
                $state.go('access.offline');
            })
        }

        function fetchRSSData() {
            console.log('fetch rss data');
            // console.log($rootScope.RSSarray);
            //promises array of $http requests for all RSS links to fetch RSS details
            _.each($rootScope.RSSarray, function (n) {
                promises.push($http.get(adminurl + 'getSingleArticles?id=' + n.typeid, {withCredentials: false}))
            })
            // console.log(promises);
            // console.log($scope.RSS);

            //Data from all promises then fetched together
            $q.all(promises).then(function (data) {
                _.each(data, function (RSS) {
                    $scope.RSS.push(RSS.data);
                    // console.log($scope.RSS);
                });
                //Create RSS.feed property with empty array for full length
                _.each($scope.RSS, function () {
                    RSS.feeds.push({});
                    // console.log('RSS', RSS);
                })
                _.each($scope.RSS, function (n, index) {
                    n.name = $rootScope.RSSarray[index].name;
                    n.typeid = $rootScope.RSSarray[index].typeid;
                    var content = n.content.replace(/<[^>]*>/g, '');
                    content = content.replace(' ', '').toLowerCase();
                    content = content.replace('nbsp', '');
                    content = content.replace(/[^a-zA-Z,]/g, "");
                    n.categories = content.split(',');
                    _.each(n.categories, function (category) {
                        categories.push(category);
                    })
                });
                var uniqArray = _.uniq(categories);
                _.each(uniqArray, function (n) {
                    $scope.categories.push(n);
                })
                $scope.categories.unshift('All');
                // console.log($scope.RSS);
                $localForage.setItem('rssData', $scope.RSS);
                $localForage.getItem('rssData').then(function (data) {
                    // console.log(data);
                });
                $scope.RSSLoading = false;
            });
        }

        // loadMainSlider();
        // loadPromoSlider();
        // loadRSS();
// ------------------------------ S C O P E  F U N C T I O N S -----------------------------

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
            else if (links.linktypename == "Home") {
                $state.go("app." + $rootScope.homeLink);

            }
            else {
                $state.go("app." + links.linktypelink, {id: links.typeid, name: links.name});
            }
        }

        $scope.goToRssSingle = function (name, title) {
            // console.log(title);
            $state.go('app.RSSsingle', {name: name, title: title});
        }

        function refreshRSS(){
            $localForage.setItem('rssData', null);
            $scope.RSS.length = 0;
            $scope.categories.length = 0;
            $rootScope.RSSarray = [];
            promises = [];
            categories = [];
            fetchConfigData();
        }

        $scope.refreshAllData = function () {
            $localForage.setItem('mainSlider', null);
            $localForage.setItem('promoSlider', null);
            // HomePage5Info.promos.length = 0;
            // HomePage5Info.data.length = 0;
            // RSS.data.length = 0;
            $scope.banners.length = 0;
            $scope.slides.length = 0;

            loadMainSlider();
            loadPromoSlider();
            refreshRSS();
        }

        function init() {
            // $scope.refreshSlider = true;
            // $timeout(function(){
            //     $scope.refreshSlider = false;
            // },100);
            loadMainSlider();
            loadPromoSlider();
            loadRSS();
        }

        $scope.$on("$ionicView.enter", function (event, data) {
            init();
        });

        if($stateParams.trigger){
            refreshRSS();
            if(window.cordova) {
                $cordovaToast.showShortCenter('Current feed was removed by Admin');
            }
        }
    })
;
