angular.module('starter')

    .controller('EcommAppCtrl', function($scope, $ionicLoading, $ionicModal, $ionicPopup, $ionicPopover, $ionicSlideBoxDelegate, 
                                         $ionicScrollDelegate, $http, $cordovaNetwork, CategoriesService, $timeout) {

    /* Load configuration from config.js */
        console.log('ecomm app started');
    $scope.appTitle = config.title;
    $scope.views = {
        homePage: config.views.homePage,
        cart: config.views.cart,
        contact: config.views.contact
    };
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
    document.addEventListener("deviceready", function () {
        var online = $cordovaNetwork.isOnline()
        if(!online) {
            $scope.notification(config.messages.no_internet);
        }
    }, false);
    /* End check internet connection */

    $scope.currency = config.currency;

    $scope.cartItems = [];
    $scope.cartLength = 0;
    $scope.cartTotal = 0.00;

    /* Loading Screen */
    $scope.showLoading = function() {
        $ionicLoading.show({
            template: '<ion-spinner icon="spiral"></ion-spinner>'
        });
    };
    $scope.hideLoading = function(){
        $ionicLoading.hide();
    };
    /* End Loading Screen */


    /* Menu Elements */
    $scope.isShown = function(menuTree) {
        return $scope.shownItems === menuTree;
    }
    $scope.toggleMenu = function(menuTree) {
        if($scope.isShown(menuTree)) $scope.shownItems = null;
        else $scope.shownItems = menuTree;
    }
    var categories_tree = [];
    var children_categories = [];
    var parent_categories = [];
    $scope.showLoading();
    CategoriesService.getData()
        .then(function(data) {
            for(i=0; i<data.length; i++) {
                if(data[i].parent <= 0) parent_categories.push(data[i]);
                else children_categories.push(data[i]);
            }
            for(i=0; i<parent_categories.length; i++) {
                var children_of_this = [];
                var tree_object;
                for(j=0; j<children_categories.length; j++) {
                    if(children_categories[j].parent == parent_categories[i].id) children_of_this.push(children_categories[j]);
                }
                tree_object = {
                    name: parent_categories[i].name,
                    children: children_of_this
                };
                categories_tree.push(tree_object);
            }
            $scope.main_categories = parent_categories;
            $scope.menu_categories = categories_tree;
            $scope.hideLoading();
        }, function(error) {
            $scope.notification(config.messages.server);
        });
    /* End Menu Elements */

    /* Custom Notification */
    $scope.notification = function(message) {
        $ionicLoading.show({ template: message, noBackdrop: true});
    }
    /* End Custom Notification */

    /* Image Gallery Popup */
    $scope.zoomMin = 1;
    $ionicModal.fromTemplateUrl('templates/ecomm/gallery.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.gallery = modal;
    });
    $scope.showGallery = function(images, index) {
        $ionicSlideBoxDelegate.slide(index,0);
        $scope.galleryImages = images;
        $scope.gallery.show();
    };

    $scope.closeGallery = function() {
        $scope.gallery.hide();
    };
    $scope.updateSlideStatus = function(slide) {
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
    }).then(function(modal) {
        $scope.cartModal = modal;
    });
    $scope.openCart = function() {
        $scope.cartModal.show();
    };
    $scope.closeCart = function() {
        $scope.cartModal.hide();
    };

    $scope.addToCart = function(product) {
        $scope.showLoading();
        var exists = false;
        for(i=0; i<$scope.cartItems.length; i++) {
            if($scope.cartItems[i].id == product.id) {
                exists = true;
                break;
            }
        }
        if(!exists) {
            product.attrValues = [];
            for(var key in product.selectedAttrs) {
                product.attrValues.push(key+': '+product.selectedAttrs[key]);
            }
            $scope.cartItems.push(product);
            $scope.cartLength++;
            var total = (parseFloat(product.price)+parseFloat($scope.cartTotal)).toFixed(2);
            $scope.cartTotal = total;
            //toastr.success(config.messages.added_cart);
        }
        else {
            //toastr.warning(config.messages.exists_cart);
        }
        $scope.hideLoading();
    }

    $scope.removeFromCart = function(product) {
        var confirmPopup = $ionicPopup.confirm({
            title: config.alerts.remove_cart.title,
            template: config.alerts.remove_cart.message,
            buttons: [
                {text:config.buttons.cancel},
                {
                    text:config.buttons.ok,
                    type: 'button-positive',
                    onTap: function(e) {
                        return true;
                    }
                }
            ]
        });
        confirmPopup.then(function(res) {
            if(res) {
                for(i=0; i<$scope.cartItems.length; i++) {
                    if($scope.cartItems[i].id == product.id) {
                        $scope.cartItems.splice(i,1);
                        $scope.cartLength = $scope.cartLength-1;
                        $scope.cartTotal = (parseFloat($scope.cartTotal)-parseFloat(product.price)).toFixed(2);
                    }
                }
            }
        });
    }

    $scope.emptyCart = function() {

        var confirmPopup = $ionicPopup.confirm({
            title: config.alerts.empty_cart.title,
            template: config.alerts.empty_cart.message,
            buttons: [
                {text:config.buttons.cancel},
                {
                    text:config.buttons.ok,
                    type: 'button-positive',
                    onTap: function(e) {
                        return true;
                    }
                }
            ]
        });
        confirmPopup.then(function(res) {
            if(res) {
                $scope.cartItems = [];
                $scope.cartLength = 0;
                $scope.cartTotal = 0.00;
            }
        });
    }

    $scope.checkout = function() {
        var number = 0;
        var link = config.checkout;
        var variationsId = [];
        for(i=0; i<$scope.cartItems.length; i++) {
            var url = link+'?add-to-cart='+$scope.cartItems[i].id;
            for(var key in $scope.cartItems[i].selectedAttrs) {
                number++;
                url = url+'&attribute_pa_'+key.toLowerCase()+'='+$scope.cartItems[i].selectedAttrs[key];
                for(var variationIndex in $scope.cartItems[i].variations) {
                    if(search($scope.cartItems[i].variations[variationIndex].attributes, 'name', key, 'option', $scope.cartItems[i].selectedAttrs[key]) != -1) {
                        variationsId.push($scope.cartItems[i].variations[variationIndex].id);
                    }
                }
            }
            if(variationsId.length > 0) {
                var variationId = getDuplicate(variationsId, number);
                url = url+'&variation_id='+variationId;
            }
            cordova.InAppBrowser.open(url, '_blank', 'location=no,hidden=yes');
        }
        var ref = cordova.InAppBrowser.open(link, '_blank', 'location=yes');
    }
    /* End Cart Page */


    /* Stock Quantity Popover */
    $scope.stockQty = 0;
    $ionicPopover.fromTemplateUrl('templates/ecomm/stock-popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.stockPopover = popover;
    });

    $scope.openStockPopover = function(qty,$event) {
        if(qty != null) {
            $scope.stockQty = qty;
            $scope.stockPopover.show($event);
        }
    }
    $scope.closeStockPopover = function(qty) {
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
    $scope.changePrice = function(product) {
        if (product.price % 1 == 0) product.price = product.price+'.00';
    }

    /*
     * Check if cart items length overflow
     */
    $scope.isOverflow = function(number) {
        if(number > 9) return 'cart-number-small';
        return '';
    }

    /*
     * Buying a product
     */
    $scope.buy = function(product) {
        var ref = cordova.InAppBrowser.open(product.permalink, '_blank', 'location=yes');
    }
        
        $timeout(function(){
            $state.go('ecomm.home')
        },500)

    /* End Custom Functions */
})
