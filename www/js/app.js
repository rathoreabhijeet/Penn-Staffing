var socialShare = {};
var push = {};
var googleanalyticsid = 'UA-67616258-1';

function addanalytics(screen) {
    if (window.analytics) {
        window.analytics.startTrackerWithId(googleanalyticsid);
        if (screen) {
            window.analytics.trackView(screen);
            window.analytics.trackEvent("Page Load", screen, screen, 1);
        } else {
            window.analytics.setUserId(user.id);
            window.analytics.trackEvent("User ID Tracking", "User ID Tracking", "Userid", user.id);
        }
    }
}


angular.module('starter', ['ionic.contrib.drawer', 'ionic', 'ngCordova', 'ionic-cache-src',
    'starter.services', 'ion-gallery', 'ngCordova', 'ngSanitize', 'LocalForageModule'])
    .run(function ($ionicPlatform, MyServices, $rootScope,$localForage,$state, $ionicHistory) {
        // $localForage.clear();
        $ionicPlatform.ready(function () {
            console.log('ionic ready');
            if (window && window.plugins && window.plugins.socialsharing && window.plugins.socialsharing.share) {
                socialShare = window.plugins.socialsharing.share;
            }
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // StatusBar.overlaysWebView(true);
                // StatusBar.styleLightContent();
                StatusBar.styleDefault();
            }
            if (window.cordova && window.cordova.platformId == 'android') {
                StatusBar.backgroundColorByHexString("#000000");
            }

            $ionicPlatform.registerBackButtonAction(function () {
                console.log($state.current.name);
                console.log($rootScope.thisIsHome);
                if ($state.current.name == 'app.' + $rootScope.thisIsHome) {
                    if(window.cordova){
                        var onConfirm3 = function (buttonIndex) {

                            if (buttonIndex == 1) {
                                navigator.app.exitApp();
                            }
                            else{
                            }
                        };
                        navigator.notification.confirm(
                            'Sure you want to exit the app?', // message
                            onConfirm3,            // callback to invoke with index of button pressed
                            'Exit App',           // title
                            ['Leave', 'Stay']     // buttonLabels
                        );
                    }
                    else {
                        var action = confirm("Do you want to Exit?");
                        if (action) {
                            navigator.app.exitApp();
                        }
                    }

                } else {
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $state.go('home');
                    //go to home page
                }
            }, 100);
            // push = PushNotification.init({
            //     "android": {
            //         "senderID": "824698645594",
            //         "icon": "www/img/icon.png"
            //     },
            //     "ios": {
            //         "alert": "true",
            //         "badge": "true",
            //         "sound": "true"
            //     },
            //     "windows": {}
            // });

            // push.on('registration', function (data) {
            //     console.log(data);
            //
            //     function setNoti(data) {
            //         if (data) {
            //             $.jStorage.set("notificationDeviceId", data);
            //         }
            //     }
            //
            //     if (!$.jStorage.get("notificationDeviceId")) {
            //         $.jStorage.set("token", data.registrationId);
            //         var isIOS = ionic.Platform.isIOS();
            //         var isAndroid = ionic.Platform.isAndroid();
            //         if (isIOS) {
            //             $.jStorage.set("os", "iOS");
            //         } else if (isAndroid) {
            //             $.jStorage.set("os", "Android");
            //         }
            //         MyServices.setNotificationToken(setNoti);
            //     }
            //
            // });
            //
            // push.on('notification', function (data) {
            //     console.log(data);
            // });
            //
            // push.on('error', function (e) {
            //     conosle.log("ERROR");
            //     console.log(e);
            // });

            console.log(window.devicePixelRatio);

        });
        $rootScope.clickedMenuItem = '';
        $rootScope.adminurl = "http://power5.simpl.life/index.php/json/";

        //Check permission for file storage and usage
        function checkPermissionCallback(status) {
            if (!status.hasPermission) {
                var errorCallback = function () {
                    console.warn('storage permission is not turned on');
                }

                permissions.requestPermission(
                    permissions.WRITE_EXTERNAL_STORAGE,
                    function (status) {
                        if (!status.hasPermission) errorCallback();
                    },
                    errorCallback);
            }
        }
        
        // Permission for file storage and usage, for Android > M
        document.addEventListener("deviceready", onDeviceReady, false);

        function onDeviceReady() {
            $rootScope.android = '';
            if (window.cordova && device.platform == 'Android' && parseInt(device.version[0]) >= 6) {
                $rootScope.android = 'M';
                var permissions = cordova.plugins.permissions;
                permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, checkPermissionCallback, null);

            }
            console.log('android ', $rootScope.android);
        }
        
        $rootScope.staging = true;

    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
        console.log('config');
        $ionicConfigProvider.views.maxCache(0);
        $httpProvider.defaults.withCredentials = true;
        $ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-left').previousTitleText(false);
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.tabs.style('standard');

        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })

            .state('access', {
                url: '/access',
                abstract: true,
                templateUrl: 'templates/access.html',
                controller: 'AccessCtrl'
            })

            .state('access.login', {
                url: '/login',
                views: {
                    'content': {
                        templateUrl: 'templates/accessView/login.html',
                        controller: "LoginCtrl"
                    }
                }
            })

            .state('access.signup', {
                url: '/signup',
                views: {
                    'content': {
                        templateUrl: 'templates/accessView/signup.html',
                        controller: "LoginCtrl"
                    }
                }
            })

            .state('access.resetpassword', {
                url: '/resetpassword',
                views: {
                    'content': {
                        templateUrl: 'templates/accessView/resetpassword.html',
                        controller: "ResetPasswordCtrl"
                    }
                }
            })

            .state('access.offline', {
                url: '/offline',
                views: {
                    'content': {
                        templateUrl: 'templates/accessView/offline.html',
                        controller: "OfflineCtrl"
                    }
                }
            })

            .state('access.forgotpassword', {
                url: '/forgotpassword',
                views: {
                    'content': {
                        templateUrl: 'templates/accessView/forgotpassword.html',
                        controller: 'ForgotPasswordCtrl'
                    }
                }
            })

            .state('app.home', {
                url: '/home',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/home.html',
                        controller: "HomeCtrl"
                    }
                }
            })

            .state('app.home5', {
                url: '/home5',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/home5.html',
                        controller: "Home5Ctrl"
                    }
                }
            })

            .state('app.home99', {
                url: '/home99/:trigger',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/home99.html',
                        controller: "Home99Ctrl"
                    }
                }
            })

            .state('app.about', {
                url: '/about',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/about.html',
                        controller: "AboutCtrl"
                    }
                }
            })

            .state('app.team', {
                url: '/team',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/team.html',
                        controller: "TeamCtrl"
                    }
                }
            })

            .state('app.article', {
                url: '/article/:id/:name/:articleName',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/article.html',
                        controller: "ArticleCtrl"
                    }
                }
            })

            .state('app.profile', {
                url: '/profile',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/profile.html',
                        controller: "ProfileCtrl"
                    }
                }
            })

            .state('app.events', {
                url: '/events',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/events.html',
                        controller: "EventsCtrl"
                    }
                }
            })

            .state('app.eventdetail', {
                url: '/eventdetail/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/eventdetail.html',
                        controller: "EventDetailCtrl"
                    }
                }
            })

            .state('app.blogs', {
                url: '/blogs',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/blogs.html',
                        controller: "BlogsCtrl"
                    }
                }
            })

            .state('app.blogdetail', {
                url: '/blogdetail/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/blogdetail.html',
                        controller: "BlogDetailCtrl"
                    }
                }
            })

            .state('app.photogallerycategory', {
                url: '/photogallerycategory',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/photogallerycategory.html',
                        controller: "PhotoGalleryCategoryCtrl"
                    }
                }
            })

            .state('app.photogallery', {
                url: '/photogallery/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/photogallery.html',
                        controller: "PhotoGalleryCtrl"
                    }
                }
            })

            .state('app.videogallerycategory', {
                url: '/videogallerycategory',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/videogallerycategory.html',
                        controller: "VideoGalleryCategoryCtrl"
                    }
                }
            })

            .state('app.videogallery', {
                url: '/videogallery/:id/:image',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/videogallery.html',
                        controller: "VideoGalleryCtrl"
                    }
                }
            })

            .state('app.account', {
                url: '/account',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/account.html',
                        controller: "AccountCtrl"
                    }
                }
            })

            .state('app.setting', {
                url: '/setting',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/setting.html',
                        controller: "SettingCtrl"
                    }
                }
            })

            .state('app.social', {
                url: '/social',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/social.html',
                        controller: "SocialCtrl"
                    }
                }
            })

            .state('app.notification', {
                url: '/notification',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/notification.html',
                        controller: "NotificationCtrl"
                    }
                }
            })

            .state('app.contact', {
                url: '/contact',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/contact.html',
                        controller: "ContactCtrl"
                    }
                }
            })

            .state('app.search', {
                url: '/search',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/search.html',
                        controller: "SearchCtrl"
                    }
                }
            })
            .state('app.landing', {
                url: '/landing',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/landing.html',
                        controller: "landingCtrl"
                    }
                }
            })

            .state('app.RSS', {
                url: '/RSS',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/RSS.html',
                        controller: "RSSCtrl"
                    }
                }
            })

            .state('app.RSSsingle', {
                url: '/RSSsingle/:name/:title',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/RSSsingle.html',
                        controller: "RSSsingleCtrl"
                    }
                }
            })
            .state('app.RSSarticle', {
                url: '/RSSarticle/:index/:parent',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/appView/RSSarticle.html',
                        controller: "RSSarticleCtrl"
                    }
                }
            })
            .state('walkthrough', {
                url: '/walkthrough',
                templateUrl: 'templates/appView/walkthrough.html',
                controller: "walkthroughCtrl"

            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/landing');

    })



var formvalidation = function (allvalidation) {
    var isvalid2 = true;
    for (var i = 0; i < allvalidation.length; i++) {
        if (allvalidation[i].field == "" || !allvalidation[i].field) {
            allvalidation[i].validation = "ng-dirty";
            isvalid2 = false;
        } else {
            allvalidation[i].validation = "";
        }
    }
    return isvalid2;
}
