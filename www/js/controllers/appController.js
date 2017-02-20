var reloadpage = false;
var configreload = {};
angular.module('starter')


    .controller('AppCtrl', function ($scope, $window, $ionicModal, $timeout, MyServices,
                                     $ionicLoading, $location, $filter, ArticlesInfo, $cordovaNetwork,
                                     $rootScope, $q, RSS, Config, $localForage, MenuData) {
        // addanalytics("flexible menu");

        // ------------------------------ I N I T I A L I Z E -----------------------------
        var devH = $window.innerHeight;
        var devW = $window.innerWidth;
        $scope.fullDim = {'height': devH + 'px', 'width': devW + 'px'};
        $scope.menudata = MenuData.data;
        var loginstatus = false;


        //Keeps the sidemenu hidden
        $scope.showMenu = false;


        //Array for RSS feeds and binding it to factory
        if (RSS.menuData.length == 0) {
            $rootScope.RSSarray = [];
        }
        $rootScope.RSSarray = RSS.menuData;

        // ------------------------------ I N N E R  F U N C T I O N S -----------------------------

        //Checks for URL in page title, for RSS feed
        function isURL(s) {
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            return regexp.test(s);
        }

        //checks internet access
        function internetaccess(toState) {
            if (window.cordova) {
                if ($cordovaNetwork.isOffline()) {
                    onoffline = false;
                    $location.url("/access/offline");
                } else {
                    onoffline = true;
                }
            }
        }

        configreload.func = function () {
            $scope.menudata.length=0;
            var data = Config.data;
            console.log('config data');
            console.log(Config.data);
            $localForage.getItem('config').then(function (forageData) {
                console.log(forageData);
                if (forageData) {
                    data = angular.copy(forageData);
                }

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


                        //Detecting a # in Home page name to decide redirection
                        if (newmenu.link == 'home') {
                            var number;
                            //Find index of # in item name, if it exists
                            if (newmenu.name.indexOf('#') != -1) {
                                number = newmenu.name.substring(newmenu.name.indexOf('#') + 1, newmenu.name.length);
                                //Change Menu name to Home itself
                                newmenu.name = newmenu.name.replace('#' + number, '');
                            }
                            //Change link to numbered homePage
                            newmenu.link = 'home' + number;
                            // console.log('redirection to home' + number);

                            //Custom home name
                            $rootScope.homeName = newmenu.name;
                            $rootScope.homeLink = 'home' + number;
                        }

                        //If there is URL in page name, it means it contains RSS feed links
                        if (n.linktypename == "Pages" && isURL(n.articlename)) {
                            $rootScope.RSSarray.push(newmenu);
                        }
                        else {
                            $timeout(function(){
                                $scope.menudata.push(newmenu);
                            },50);
                        }
                        // console.log(n)
                    }

                });
                $timeout(function() {
                    console.log('menudata');
                    console.log($scope.menudata);
                    console.log('rssarray');
                    console.log($rootScope.RSSarray);
                    _.each($scope.menudata, function (n) {
                        if (n.link == 'article') {
                            ArticlesInfo.data.push(n);
                        }
                    })
                    // console.log(ArticlesInfo.data);
                    $scope.contact = data.config[5];
                    $scope.menu = {};
                    $scope.menu.setting = false;
                    var blogdata1 = JSON.parse(data.config[0].text);

                    // config data
                    var blogdata = JSON.parse(data.config[1].text);
                    for (var i = 0; i < blogdata.length; i++) {
                        if (blogdata[i].value == true) {
                            $scope.menudata.blogs = true;
                            $.jStorage.set("blogType", blogdata[i]);
                            break;
                        } else {
                            $scope.menudata.blogs = false;
                        }
                    }
                    _.each(blogdata1, function (n) {
                        if (n.value == true) {
                            loginstatus = true;
                        }
                    });

                    $scope.logso = "";
                    if (loginstatus == false) {
                        $scope.menu.setting = false;
                    } else {
                        $scope.menu.setting = true;
                        $scope.logso = "has-menu-photo";
                    }
                },500);
            });

        };

        // ------------------------------ S C O P E  F U N C T I O N S -----------------------------


        $scope.openTheDrawer = function () {
            // console.log('asdasdas')
            $scope.showMenu = true;
        };


        // spinner 
        $scope.showloading = function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });
            $timeout(function () {
                $ionicLoading.hide();
            }, 5000);
        };

        // ------------------------------ A P I  C A L L S -----------------------------
        

    })

  