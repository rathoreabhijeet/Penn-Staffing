var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('landingCtrl', function ($state, $timeout, $localForage, $rootScope, MyServices, $cordovaNetwork) {
        // $timeout(function(){
        //     navigator.splashscreen.hide();
        // },2000)
        // $timeout(function () {

        function checkOnline(){
            if(window.cordova) {
                if ($cordovaNetwork.isOnline()) {
                    return true;
                }
                else {
                    var onConfirm3 = function (buttonIndex) {
                        return false;
                    };
                    navigator.notification.confirm(
                        'Your device seems to be offline. Please check the connection and try again.', // message
                        onConfirm3,            // callback to invoke with index of button pressed
                        'Device Offline',           // title
                        'OK'     // buttonLabels
                    );
                }
            }
            else{
                return true;
            }
        }

        console.log('landing');
        var checkFirstLoad = function () {
            if(checkOnline()) {
                $localForage.getItem('firstLoad').then(function (data) {
                    console.log(data);
                    if (data != null) {
                        console.log('1');
                        $rootScope.firstLoad = false;
                        $state.go('app.' + $rootScope.thisIsHome);
                    }
                    else {
                        console.log('2');
                        $rootScope.firstLoad = true;
                        $state.go('walkthrough');
                    }
                })
            }
        }
        // }, 4000);

        //Function to check which is the home screen to be rediected to
        var checkHomeScreen = function () {
            if(window.cordova) {
                $timeout(function () {
                    navigator.splashscreen.hide()
                }, 2000);
            }
            // $timeout(function () {
            if(checkOnline()) {
                MyServices.getallfrontmenu(function (data) {
                    MyServices.setconfigdata(data);
                    // $scope.setup();

                    // var data = MyServices.getconfigdata();
                    // console.log(data);
                    console.log(_.filter(data.menu, function (n) {
                        return n.linktypelink == 'home';
                    }));
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
                    // }, 5000)
                }, function (err) {
                    // console.log('2');

                })
            }
        }

        if(window.cordova) {
            document.addEventListener("deviceready", deviceReady, false);
        }
        else{
            deviceReady();
        }

        function deviceReady() {
            checkHomeScreen();
        }


    })
