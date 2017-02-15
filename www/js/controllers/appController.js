var reloadpage = false;
var configreload = {};
angular.module('starter')


    .controller('AppCtrl', function ($scope, $window, $ionicModal, $timeout, MyServices,
                                     $ionicLoading, $location, $filter, ArticlesInfo,
                                     $cordovaNetwork, $rootScope, $q, RSS, $http, $state,
                                     $ionicPopup, $ionicPopover, $ionicSlideBoxDelegate,
                                     $ionicScrollDelegate, CategoriesService, WooCategories,
                                     $cordovaToast, WC, Shop, $localForage, allOrders) {
        addanalytics("flexible menu");
        var devWidth = $window.innerWidth;
        var devHeight = $window.innerHeight;
        var cartItemsSavedInLocalForage = [];
        $scope.wooCommCatThumb = 0.25 * devWidth;
        $scope.wooCategoriesDiv = {'height': 0.6 * devHeight + 'px'};
        $scope.wooFixed = {'height': 0.15 * devHeight + 'px'};
        var isURL = function (s) {
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            return regexp.test(s);
        }
        $scope.showMenu = false;
        if (RSS.menuData.length == 0) {
            $rootScope.RSSarray = [];
        }
        $rootScope.RSSarray = RSS.menuData;

        var devH = $window.innerHeight;
        var devW = $window.innerWidth;

        $scope.fullDim = {'height': devH + 'px', 'width': devW + 'px'};
        $scope.openTheDrawer = function () {
            // console.log('asdasdas')
            $scope.showMenu = true;
        }
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

        // $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        //     console.log(toState);
        //     internetaccess(toState);
        // });
        // window.addEventListener("offline", function (e) {
        //     internetaccess();
        // })
        // window.addEventListener("online", function (e) {
        //     internetaccess();
        // })

        $scope.menudata = [];
        var loginstatus = false;

        // loader
        $scope.showloading = function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });
            $timeout(function () {
                $ionicLoading.hide();
            }, 5000);
        };
        //	$scope.showloading();
        configreload.onallpage = function () {
            var loginstatus = false;
            if (MyServices.getconfigdata()) {
                _.each(MyServices.getconfigdata().config[0], function (n) {
                    if (n.value == true) {
                        loginstatus = true;
                    }
                });
            }
            if (loginstatus == true && !MyServices.getuser()) {

                // console.log('go to login');
                $location.url("/access/login");
            }
        }
        configreload.func = function () {
            $scope.menudata = [];
            var data = MyServices.getconfigdata();
            _.each(data.config[0], function (n) {
                if (n.value == true) {
                    loginstatus = true;
                }
            });
            // console.log('menu initial data');
            console.log(data);
            _.each(data.menu, function (n, index) {
                if (loginstatus == false) {
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
                            console.log('redirection to home' + number);

                            //Custom home name
                            $rootScope.homeName = newmenu.name;
                            console.log(newmenu.link);
                            $rootScope.homeLink = 'home' + number;

                        }

                        //If there is URL in page name, it means it contains RSS feed links
                        if (n.linktypename == "Pages" && isURL(n.articlename)) {
                            $rootScope.RSSarray.push(newmenu);
                        }
                        else if (n.name == "Return Policy") {
                            $scope.returnPolicy = newmenu;
                        }
                        else {
                            $scope.menudata.push(newmenu);
                        }
                        // console.log(n)
                    }

                    // console.log($rootScope.RSSarray);
                } else {
                    // console.log('else');

                    var newmenu = {};
                    newmenu.id = n.id;
                    newmenu.name = n.name;
                    newmenu.order = n.order;
                    newmenu.icon = n.icon;
                    newmenu.link_type = n.linktypename;
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
                    if (n.linktypename == "Pages" && isURL(n.articlename)) {
                        $rootScope.RSSarray.push(newmenu);
                    }
                    else {
                        $scope.menudata.push(newmenu);
                    }
                }
            });
            console.log($scope.menudata);
            console.log($rootScope.RSSarray);
            ArticlesInfo.data = $scope.menudata;
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
        }

        MyServices.getallfrontmenu(function (data) {
            MyServices.setconfigdata(data);
            _.each(data.config[0], function (n) {
                if (n.value == true) {
                    loginstatus = true;
                }
            });
            configreload.func();
        }, function (err) {
            $location.url("/access/offline");
        })

        var logoutsuccess = function (data, success) {
            if (data == 'true') {
                $.jStorage.flush();
                reloadpage = true;
                $ionicLoading.hide();
                $location.path("/access/login");
            }
        }
        $scope.logout = function () {
            $ionicLoading.show();
            MyServices.logout(logoutsuccess, function (err) {
                $location.url("/access/offline");
            });
        }

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/accessView/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {

            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };

        if ($.jStorage.get("user")) {

            MyServices.getsingleuserdetail(function (data) {
                $scope.userdetails = data;
                $scope.userdetails.myimage = {
                    'background-image': "url('" + $filter("profileimg")(data.image) + "')"
                };
            }, function (err) {
                $location.url("/access/offline");
            });

        }

        ///////////////////////////// E C O M M  P A R T ///////////////////////////////

        $scope.appTitle = config.title;
        // $scope.views = {
        //     homePage: config.views.homePage,
        //     cart: config.views.cart,
        //     contact: config.views.contact
        // };
        $scope.empty = config.messages.empty;
        $scope.empty_cart = config.messages.empty_cart;
        $scope.empty_shop = config.messages.empty_shop;
        $scope.sale_text = config.messages.sale_text;
        $scope.in_stock = config.messages.in_stock;
        $scope.total_text = config.messages.total;
        $scope.home_menu = config.buttons.home;
        $scope.add_cart_btn = config.buttons.add_cart;
        $scope.buy_btn = config.buttons.buy;
        $scope.checkout_btn = config.buttons.checkout;
        $scope.empty_btn = config.buttons.empty;

        /* End load configuration */

        /* Check internet connection */
        // document.addEventListener("deviceready", function () {
        //     var online = $cordovaNetwork.isOnline()
        //     if(!online) {
        //         $scope.notification(config.messages.no_internet);
        //     }
        // }, false);
        /* End check internet connection */

        $scope.currency = config.currency;
        var LOCAL_TOKEN_KEY = Shop.name + "-cart";

        //var cartItemsSavedInLocalForage = $localForage.getItem(LOCAL_TOKEN_KEY);
        $localForage.getItem(LOCAL_TOKEN_KEY).then(function (data) {
            if (data) {
                _.each(data, function (item) {
                    $rootScope.cartItems.push(item);
                    console.log(item);
                    $scope.cartLength++;
                    $scope.cartTotal += parseInt(item.price);
                })
            }
            console.log($rootScope.cartItems);
        });
        $localForage.getItem('orders').then(function (data) {
            if (data != null) {
                allOrders.data = data;
            }
            console.log(allOrders.data);
        })
        $rootScope.cartItems = [];
        $scope.cartLength = 0;
        $scope.cartTotal = 0.00;

        /* Loading Screen */
        $scope.showLoading = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="spiral"></ion-spinner>'
            });
        };
        $scope.hideLoading = function () {
            $ionicLoading.hide();
        };
        /* End Loading Screen */


        /* Menu Elements */
        $scope.isShown = function (menuTree) {
            return $scope.shownItems === menuTree;
        }
        $scope.toggleMenu = function (menuTree) {
            if ($scope.isShown(menuTree)) $scope.shownItems = null;
            else $scope.shownItems = menuTree;
        }
        $scope.menu_categories = [];
        var children_categories = [];
        $scope.main_categories = [];
        WooCategories.main = $scope.main_categories;
        WooCategories.menu = $scope.menu_categories;
        // $scope.showLoading();
        CategoriesService.getData()
            .then(function (data) {
                for (i = 0; i < data.length; i++) {
                    if (data[i].parent <= 0) $scope.main_categories.push(data[i]);
                    else children_categories.push(data[i]);
                }
                for (i = 0; i < $scope.main_categories.length; i++) {
                    var children_of_this = [];
                    var tree_object;
                    for (j = 0; j < children_categories.length; j++) {
                        if (children_categories[j].parent == $scope.main_categories[i].id) children_of_this.push(children_categories[j]);
                    }
                    tree_object = {
                        name: $scope.main_categories[i].name,
                        children: children_of_this
                    };
                    $scope.menu_categories.push(tree_object);
                }
                // _.each(parent_categories,function(n){
                //     $scope.main_categories.push(n);
                // })
                // _.each(categories_tree,function(n){
                //     $scope.menu_categories.push(n);
                // })
                $scope.hideLoading($scope.main_categories);
                console.log($scope.main_categories);
                console.log($scope.menu_categories);

            }, function (error) {
                $scope.notification(config.messages.server);
            });
        /* End Menu Elements */

        /* Custom Notification */
        $scope.notification = function (message) {
            $ionicLoading.show({template: message, noBackdrop: true});
        }
        /* End Custom Notification */

        /* Image Gallery Popup */
        $scope.zoomMin = 1;
        $ionicModal.fromTemplateUrl('templates/ecomm/gallery.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.gallery = modal;
        });
        $scope.showGallery = function (images, index) {
            $ionicSlideBoxDelegate.slide(index, 0);
            $scope.galleryImages = images;
            $scope.gallery.show();
        };

        $scope.closeGallery = function () {
            $scope.gallery.hide();
        };
        $scope.updateSlideStatus = function (slide) {
            var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
            if (zoomFactor == $scope.zoomMin) {
                $ionicSlideBoxDelegate.enableSlide(true);
            } else {
                $ionicSlideBoxDelegate.enableSlide(false);
            }
        };
        /* End image gallery popup */

        /* Cart Page */
        $ionicModal.fromTemplateUrl('templates/ecomm/cart.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.cartModal = modal;
        });
        $rootScope.openCart = function () {
            $scope.cartModal.show();
        };
        $rootScope.closeCart = function () {
            $scope.cartModal.hide();
        };

        $scope.addToCart = function (product) {
            $scope.showLoading();

            var LOCAL_TOKEN_KEY = Shop.name + "-cart";


            var exists = false;


            for (i = 0; i < $rootScope.cartItems.length; i++) {
                if ($rootScope.cartItems[i].id == product.id) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                product.attrValues = [];
                for (var key in product.selectedAttrs) {
                    product.attrValues.push(key + ': ' + product.selectedAttrs[key]);
                }
                $rootScope.cartItems.push(product);
                console.log($rootScope.cartItems);
                $scope.cartLength++;
                var total = (parseFloat(product.price) + parseFloat($scope.cartTotal)).toFixed(2);
                $scope.cartTotal = total;
                if (window.cordova) {
                    $cordovaToast.showLongBottom(config.messages.added_cart);
                }
            }
            else {
                if (window.cordova) {
                    $cordovaToast.showLongBottom(config.messages.exists_cart);
                }
                else {
                    alert(config.messages.exists_cart);
                }
            }

            $localForage.setItem(LOCAL_TOKEN_KEY, $rootScope.cartItems); //save cartItems in localforage
            var data = $localForage.getItem(LOCAL_TOKEN_KEY).then(function (data) {
                console.log(data);
            })
            console.log($rootScope.cartItems);
            $scope.hideLoading();
        }

        $scope.removeFromCart = function (product) {
            var confirmPopup = $ionicPopup.confirm({
                title: config.alerts.remove_cart.title,
                template: config.alerts.remove_cart.message,
                buttons: [
                    {text: config.buttons.cancel},
                    {
                        text: config.buttons.ok,
                        type: 'button-positive',
                        onTap: function (e) {
                            return true;
                        }
                    }
                ]
            });
            confirmPopup.then(function (res) {
                if (res) {
                    for (i = 0; i < $rootScope.cartItems.length; i++) {
                        if ($rootScope.cartItems[i].id == product.id) {
                            $rootScope.cartItems.splice(i, 1);
                            $scope.cartLength = $scope.cartLength - 1;
                            $scope.cartTotal = (parseFloat($scope.cartTotal) - parseFloat(product.price)).toFixed(2);
                        }
                    }
                }
            });
        }

        $scope.emptyCart = function () {

            var confirmPopup = $ionicPopup.confirm({
                title: config.alerts.empty_cart.title,
                template: config.alerts.empty_cart.message,
                buttons: [
                    {text: config.buttons.cancel},
                    {
                        text: config.buttons.ok,
                        type: 'button-positive',
                        onTap: function (e) {
                            return true;
                        }
                    }
                ]
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $rootScope.cartItems = [];
                    $scope.cartLength = 0;
                    $scope.cartTotal = 0.00;
                }
            });
        }

        $scope.checkout = function () {
            var LOCAL_TOKEN_KEY = Shop.name + "-user";
            var user = window.localStorage.getItem(LOCAL_TOKEN_KEY);
            console.log(user);
            if (user) {
                $scope.cartModal.hide();
                console.log("user already loggedin");
                $state.go('app.shippingAddress');
            }

            else {
                $scope.cartModal.hide();
                $state.go('app.login');
            }

        }
        // var number = 0;
        // var link = config.checkout;
        // var variationsId = [];
        // for(i=0; i<$rootScope.cartItems.length; i++) {
        //     var url = link+'?add-to-cart='+$rootScope.cartItems[i].id;
        //     for(var key in $rootScope.cartItems[i].selectedAttrs) {
        //         number++;
        //         url = url+'&attribute_pa_'+key.toLowerCase()+'='+$rootScope.cartItems[i].selectedAttrs[key];
        //         for(var variationIndex in $rootScope.cartItems[i].variations) {
        //             if(search($rootScope.cartItems[i].variations[variationIndex].attributes, 'name', key, 'option', $rootScope.cartItems[i].selectedAttrs[key]) != -1) {
        //                 variationsId.push($rootScope.cartItems[i].variations[variationIndex].id);
        //             }
        //         }
        //     }
        //     if(variationsId.length > 0) {
        //         var variationId = getDuplicate(variationsId, number);
        //         url = url+'&variation_id='+variationId;
        //     }
        //     cordova.InAppBrowser.open(url, '_blank', 'location=no,hidden=yes');
        // }
        // var ref = cordova.InAppBrowser.open(link, '_blank', 'location=yes');
        // }
        // /* End Cart Page */


        /* Stock Quantity Popover */
        $scope.stockQty = 0;
        $ionicPopover.fromTemplateUrl('templates/ecomm/stock-popover.html', {
            scope: $scope,
        }).then(function (popover) {
            $scope.stockPopover = popover;
        });

        $scope.openStockPopover = function (qty, $event) {
            if (qty != null) {
                $scope.stockQty = qty;
                $scope.stockPopover.show($event);
            }
        }
        $scope.closeStockPopover = function (qty) {
            $scope.stockPopover.hide();
        }
        // $scope.$on('$destroy', function() {
        //     $scope.popover.remove();
        // });
        /* End Stock Quantity Popover */

        /* Custom Functions */

        /*
         * Make products price = 23.00 if it's 23
         */
        $scope.changePrice = function (product) {
            if (product.price % 1 == 0) product.price = product.price + '.00';
        }

        /*
         * Check if cart items length overflow
         */
        $scope.isOverflow = function (number) {
            if (number > 9) return 'cart-number-small';
            return '';
        }

        /*
         * Buying a product
         */
        $scope.buy = function (product) {
            var ref = cordova.InAppBrowser.open(product.permalink, '_blank', 'location=yes');
        }

        $scope.setEcommMenuStyle = function (style) {
            switch (style) {
                case 1:
                    $rootScope.ecommMenuStyle = 1;
                    break;
                case 2:
                    $rootScope.ecommMenuStyle = 2;
                    break;
                case 3:
                    $rootScope.ecommMenuStyle = 3;
                    break;
                case 4:
                    $rootScope.ecommMenuStyle = 4;
                    break;
            }
        }
        $scope.callUs24x7 = function () {
            window.open('tel:' + ('+14698080536'), '_system');
        }

        /* End Custom Functions */
    })

  