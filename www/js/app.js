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
    'starter.services', 'ion-gallery', 'ngCordova', 'ngSanitize', 'LocalForageModule','ksSwiper'])
    .run(function ($ionicPlatform, MyServices, $rootScope,$localForage, loggedInUser) {
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
        $rootScope.ecommMenu=false;
        $rootScope.ecommMenuStyle =1;
        $rootScope.adminurl = "http://power5.simpl.life/index.php/json/";
        $rootScope.tabs = [
            {'name':'Profile','icon':'ion-android-person','link':'somelink'},
            {'name':'Status','icon':'ion-ios-filing','link':'somelink'},
            {'name':'Share','icon':'ion-share','link':'somelink'},
            {'name':'Contact','icon':'ion-android-call','link':'somelink'},
            {'name':'Info','icon':'ion-ios-information','link':'somelink'}
        ];

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

        $localForage.getItem('loggedInUser').then(function(data){
            if(data!=null){
                loggedInUser.data =data;
                console.log(loggedInUser.data);
            }
        })

    })




// var formvalidation = function (allvalidation) {
//     var isvalid2 = true;
//     for (var i = 0; i < allvalidation.length; i++) {
//         if (allvalidation[i].field == "" || !allvalidation[i].field) {
//             allvalidation[i].validation = "ng-dirty";
//             isvalid2 = false;
//         } else {
//             allvalidation[i].validation = "";
//         }
//     }
//     return isvalid2;
// }
