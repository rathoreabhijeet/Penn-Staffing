var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('landingCtrl', function ($state, $timeout, $localForage, $rootScope, MyServices, Config) {

        var checkFirstLoad = function () {
            $localForage.getItem('firstLoad').then(function (data) {
                console.log(data);
                if (data != null) {
                    console.log('first load');
                    $rootScope.firstLoad = false;
                    $state.go('app.' + $rootScope.thisIsHome);
                }
                else {
                    console.log('not first load');
                    $rootScope.firstLoad = true;
                    if (window.cordova) {
                        $state.go('walkthrough');
                    }
                    else {
                        $state.go('app.' + $rootScope.thisIsHome);
                    }
                }

            })
        }

        //Function to check which is the home screen to be rediected to
        var checkHomeScreen = function () {

            var data = MyServices.getconfigdata();

            _.each(data.menu, function (n, index) {
                if (n.linktypelink == "home") {
                    console.log(n);
                    var number;
                    n.link = n.linktypelink;
                    //Find index of # in item name, if it exists
                    if (n.name.indexOf('#') != -1) {
                        number = n.name.substring(n.name.indexOf('#') + 1, n.name.length);
                        //Change Menu name to Home itself
                        n.name = n.name.replace('#' + number, '');

                        //Change link to numbered homePage
                        n.link = 'home' + number;
                    }

                    $rootScope.thisIsHome = n.link;
                    console.log($rootScope.thisIsHome);
                    //Custom home name
                    $rootScope.homeName = n.name;
                }
            })
            checkFirstLoad();

        }

        function getConfigData() {
            $timeout(function () {
                if (window.cordova) {
                    navigator.splashscreen.hide();
                }
            }, 500);
            $timeout(function () {

                $localForage.getItem('config').then(function (foragedata) {
                    if (foragedata) {
                        MyServices.setconfigdata(foragedata);
                        Config.data = foragedata;
                        configreload.func();
                        checkHomeScreen();
                    }
                    else {
                        MyServices.getallfrontmenu(function (data) {
                            MyServices.setconfigdata(data);
                            Config.data = data;
                            configreload.func();
                            console.log(data);
                            $localForage.setItem('config', data);
                            console.log('landing page');
                            checkHomeScreen();
                        }, function (err) {
                            $state.go('access.offline')
                        })
                    }
                })
            }, 3500);

        }

        getConfigData();

    })
