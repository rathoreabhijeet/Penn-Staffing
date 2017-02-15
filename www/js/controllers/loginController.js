var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('LoginCtrl', function ($scope, MyServices, $ionicPopup, $interval, $location, $window, $ionicLoading, $timeout, $cordovaNetwork) {
        addanalytics("flexible login page");
        $scope.logindata = {};
        $.jStorage.flush();

        $scope.forgotpass = function () {
            $location.url("/access/forgotpassword");
        }

        $scope.config = MyServices.getconfigdata();
        var loginstatus = false;

        function internetaccess(toState) {

            if ($cordovaNetwork.isOffline()) {
                console.log('yehi hai saala')
                onoffline = false;
                $location.url("/access/offline");
            } else {
                console.log('kya chal raha hai')
                onoffline = true;
            }

        }

        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            console.log(toState);
            internetaccess(toState);
        });
        window.addEventListener("offline", function (e) {
            internetaccess();
        })
        window.addEventListener("online", function (e) {
            internetaccess();
        })

        $scope.setup = function () {
            $scope.config = MyServices.getconfigdata();
            _.each(JSON.parse($scope.config.config[0].text), function (n) {
                if (n.name.toLowerCase() == "email" && n.value == true) {
                    $scope.logindata.email = true;
                    loginstatus = true;
                } else if (n.name.toLowerCase() == "google" && n.value == true) {
                    $scope.logindata.google = true;
                    loginstatus = true;
                } else if (n.name.toLowerCase() == "twitter" && n.value == true) {
                    $scope.logindata.twitter = true;
                    loginstatus = true;
                } else if (n.name.toLowerCase() == "instagram" && n.value == true) {
                    $scope.logindata.instagram = true;
                    loginstatus = true;
                } else if (n.name.toLowerCase() == "facebook" && n.value == true) {
                    $scope.logindata.facebook = true;
                    loginstatus = true;
                } else {
                }
            })
            if (loginstatus == false) {
                $location.url("/app/home");
            }
        }

        MyServices.getallfrontmenu(function (data) {
            MyServices.setconfigdata(data);
            $scope.setup();
        }, function (err) {
            $location.url("/access/offline");
        })

        // loader
        $scope.showloading = function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });
            $timeout(function () {
                $ionicLoading.hide();
            }, 5000);
        };

        //logins
        var checktwitter = function (data, status) {
            if (data != "false" && data != '') {
                $interval.cancel(stopinterval);
                ref.close();
                MyServices.authenticate().success(authenticatesuccess);
            } else {

            }
        };

        var callAtIntervaltwitter = function () {
            MyServices.authenticate().success(checktwitter);
        };
        var authenticatesuccess = function (data, status) {
            $ionicLoading.hide();
            if (data != "false") {
                $.jStorage.set("user", data);
                user = data;
                reloadpage = true;
                $location.url("/app/home");
            }
        };
        $scope.facebooklogin = function () {
            ref = cordova.InAppBrowser.open(adminhauth + 'login/Facebook?returnurl=http://www.wohlig.com', '_blank', 'location=no');
            stopinterval = $interval(callAtIntervaltwitter, 2000);
            ref.addEventListener('exit', function (event) {
                MyServices.authenticate().success(authenticatesuccess);
                $interval.cancel(stopinterval);
            });
        }
        $scope.twitterlogin = function () {

            ref = cordova.InAppBrowser.open(adminhauth + 'login/Twitter', '_blank', 'location=no');
            stopinterval = $interval(callAtIntervaltwitter, 2000);
            ref.addEventListener('exit', function (event) {
                MyServices.authenticate().success(authenticatesuccess);
                $interval.cancel(stopinterval);
            });
        }

        $scope.instagramlogin = function () {
            ref = cordova.InAppBrowser.open(adminhauth + 'login/Instagram?returnurl=http://www.wohlig.com', '_blank', 'location=no');
            stopinterval = $interval(callAtIntervaltwitter, 2000);
            ref.addEventListener('exit', function (event) {
                MyServices.authenticate().success(authenticatesuccess);
                $interval.cancel(stopinterval);
            });
        }

        $scope.googlelogin = function () {

            ref = cordova.InAppBrowser.open(adminhauth + 'login/Google?returnurl=http://www.wohlig.com', '_blank', 'location=no');
            stopinterval = $interval(callAtIntervaltwitter, 2000);
            ref.addEventListener('exit', function (event) {
                MyServices.authenticate().success(authenticatesuccess);
                $interval.cancel(stopinterval);
            });
        }
        // popup
        $scope.showPopupsignupsuccess = function () {

            var myPopup = $ionicPopup.show({
                template: '<p class="text-center">Successfully registered!</p>',
                title: 'Congrats!',
                scope: $scope,

            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 2000);
        };
        $scope.showPopupsignupfailure = function () {
            var myPopup = $ionicPopup.show({
                template: '<p class="text-center">User already exist</p>',
                title: 'Oops!',
                scope: $scope,

            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 2000);
        };

        //SIGN UP FORM
        $scope.signup = {};
        var signupsuccess = function (data, status) {
            if (data != "false") {
                $.jStorage.set("user", data);
                user = data;
                var myPopup = $ionicPopup.show({
                    template: '<p class="text-center">Signed up successfully!</p>',
                    title: 'Congrats!',
                    scope: $scope,

                });
                $timeout(function () {
                    myPopup.close(); //close the popup after 3 seconds for some reason
                    $location.url("/app/home");
                }, 2000);

            } else {
                $scope.showPopupsignupfailure();
            }
            $ionicLoading.hide();
            $scope.signup = {};
        }

        var msgforall = function (msg) {
            $ionicLoading.hide();
            var myPopup = $ionicPopup.show({
                template: '<p class="text-center">' + msg + '</p>',
                title: 'Login',
                scope: $scope,

            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 2000);

        }

        $scope.signupsubmit = function (signup) {
            $ionicLoading.show();
            $scope.allvalidation = [{
                field: $scope.signup.username,
                validation: ""
            }, {
                field: $scope.signup.email,
                validation: ""
            }, {
                field: $scope.signup.dob,
                validation: ""
            }, {
                field: $scope.signup.password,
                validation: ""
            }];
            var check = formvalidation($scope.allvalidation);
            if (check) {
                MyServices.signup($scope.signup, signupsuccess, function (err) {
                    $location.url("/access/offline");
                });
            } else {
                msgforall("Fill all data");
                $ionicLoading.hide();
            }

        }

        // SIGN IN
        $scope.signin = {};
        var signinsuccess = function (data, status) {
            $ionicLoading.hide();
            if (data != 'false') {

                $.jStorage.set("user", data);
                user = data;
                $location.url("/app/home");
                $scope.signin = {};
            } else {

                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Wrong username or password!'
                });
            }
        }
        $scope.signinsubmit = function (signin) {
            $ionicLoading.show();
            $scope.allvalidation = [{
                field: $scope.signin.username,
                validation: ""
            }, {
                field: $scope.signin.password,
                validation: ""
            }];
            var check = formvalidation($scope.allvalidation);
            if (check) {
                MyServices.signin(signin, signinsuccess, function (err) {
                    $location.url("/access/offline");
                });
            } else {
                msgforall("Fill all data");
                $ionicLoading.hide();
            }

        }

        //        ***** tabchange ****

        $scope.tab = 'signin';
        $scope.classa = 'active';
        $scope.classb = '';

        $scope.tabchange = function (tab, a) {

            $scope.tab = tab;
            if (a == 1) {
                $scope.classa = "active";
                $scope.classb = '';

            } else {
                $scope.classa = '';
                $scope.classb = "active";

            }
        };

        //    ****** End ******

    })
