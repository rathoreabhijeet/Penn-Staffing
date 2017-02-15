angular.module('starter')
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
        console.log('config');
        $ionicConfigProvider.views.maxCache(0);
        $httpProvider.defaults.withCredentials = true;
        $ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-left').previousTitleText(false);
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.tabs.style('standard');
        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.patch = {};
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
                url: '/home99',
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
                url: '/article/:id/:name',
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
                url: '/videogallery/:id',
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

            })

            

            .state('app.ecommhome', {
                url: '/ecommhome',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/ecomm/home.html',
                        controller: 'EcommHomeCtrl'
                    }
                }
            })
            .state('app.ecommshop', {
                url: '/ecommshop/:parent/:category',
                params: {
                    parent: ''
                },
                views: {
                    'menuContent': {
                        templateUrl: 'templates/ecomm/shop.html',
                        controller: 'EcommShopCtrl'
                    }
                }
            })
            .state('app.ecommproduct', {
                url: '/ecommproduct/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/ecomm/product.html',
                        controller: 'EcommProductCtrl'
                    }
                }
            })
            .state('app.thanks', {
                url: '/thanks',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/ecomm/thanks.html',
                        controller: 'thanksCtrl',
                        controllerAs: 'thanks'
                    }
                }
            })
            .state('app.confirm', {
                url: '/confirm',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/ecomm/confirm.html',
                        controller: 'confirmCtrl',
                        controllerAs: 'confirm'
                    }
                }
            })
            .state('app.shippingAddress', {
                url: '/shippingAddress',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/ecomm/shippingAddress.html',
                        controller: 'shippingAddressCtrl',
                        controllerAs: 'shippingAddress'
                    }
                }
            })
            .state('app.login', {
                url: '/login/:prevState',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/ecomm/login.html',
                        controller: 'loginCtrl',
                        controllerAs: 'login'
                    }
                }
            })
            .state('app.signup', {
                url: '/signup',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/ecomm/signup.html',
                        controller: 'signupCtrl',
                        controllerAs: 'signup'
                    }
                }
            })
            .state('app.orders', {
                url: '/orders',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/ecomm/orders.html',
                        controller: "ordersCtrl",
                        controllerAs: 'orders'
                    }
                }
            })
            .state('app.orderDetail', {
                url: '/orderDetail/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/ecomm/orderDetail.html',
                        controller: "orderDetailCtrl",
                        controllerAs: 'orderDetail'
                    }
                }
            })

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/landing');


        angular.extend( {
            allowHtml: true,
            maxOpened: 1,
            preventOpenDuplicates: false,
            positionClass: 'toast-bottom-center',
            timeOut: 2500,
            extendedTimeOut: 2500,
            toastClass: 'toast'
        });
    })
    .constant('Shop', {
        version                             : '2.1.2 beta',
        name                                : 'boutique',
        URL                                 : 'http://boutique.appturemarket.com',
        ConsumerKey                         : 'ck_381eed3281933b8e2bfa93fe812eed8ba2bc3d53', // Get this from your WooCommerce
        ConsumerSecret                      : 'cs_ad0f6568dd2f9d7e88e76a8050ec46a9997b6446', // Get this from your WooCommerce

        homeSlider                          : true, // If you dont want to use home slider, set it to FALSE
        CurrencyFormat                      : true, // If you want to use currency format, set it to TRUE
        shipping                            : [
            {id: 'flat_rate:4', name: 'Local Pickup', cost: 0},
            {id: 'flat_rate:3', name: 'Flat Rate', cost: 5},
            {id: 'flat_rate:2', name: 'Worldwide Flat Rate', cost: 15}
        ],
        payment                             : [
            {id: 'cod', name: 'Cash on Delivery', icon: 'fa fa-money', desc: 'Pay with cash upon delivery.'},
            {id: 'bacs', name: 'Direct Bank Transfer', icon: 'fa fa-university', desc: 'You can pay using direct bank account'},
            {id: 'paypal', name: 'Paypal', icon: 'fa fa-cc-paypal', desc: 'You can pay via Paypal and Credit Card'}
        ],

        GCM_SenderID                        : 'xxxxxxxxxxxx', // Get this from https://console.developers.google.com

        OneSignalAppID                      : 'xxxxxxxxxxxx', // Get this from https://onesignal.com
        // Change this paypal sandbox with your own
        payPalSandboxClientSecretBase64     : 'QVpqeUlTYnAxem1PaFowb19pQUczVzJJR2psejJodkVDLThjR29RN2ZYY01GTjlhZmFSdVcwWDFCMVBWU2drU3VUUVdPS3FNOU40TlRrT1A6RUVZTEtFamVNT0tqbHdXZEtYTXI2MEtRcVlZeDg1aC1aOTk0Nk1TdmhLbjEyNmtfUkpWZnpOZEc3V0dpNi14N3RKSlNjOUMxaUc5c2lKb0U=',
        payPalProductionClientSecretBase64  : 'xxxxxxxxxxxx',

        //  You need to change this url to GO LIVE!
        payPalGetTokenURL                   : 'https://api.sandbox.paypal.com/v1/oauth2/token', // to go live, use this: https://api.paypal.com/v1/oauth2/token
        payPalMakePaymentURL                : 'https://api.sandbox.paypal.com/v1/payments/payment', // to go live, use this: https://api.paypal.com/v1/payments/payment
        payPalReturnURL                     : 'http://localhost/success',
        payPalCancelURL                     : 'http://localhost/cancel'
    })
