angular.module('starter')

    .controller('confirmCtrl',confirmCtrl)
function confirmCtrl($q, $rootScope, $state, $scope,$ionicLoading,$timeout,$localForage,WC,Shop,latestOrder,allOrders) {
    var confirm = this;
    var line_items = [], subtotal = 0;
    console.log("confirm Ctrl is working");

    confirm.createOreder = function(){
        $ionicLoading.show();
        var LOCAL_TOKEN_KEY_CART = Shop.name+"-cart";
        var LOCAL_TOKEN_KEY_ORDER = Shop.name+"-order";

        $localForage.getItem(LOCAL_TOKEN_KEY_ORDER).then(function(order){
            $localForage.getItem(LOCAL_TOKEN_KEY_CART).then(function(cart){
                console.log(cart);
                console.log(order);
                for(var i in cart){
                    subtotal += cart[i].price * cart[i].qty;
                    if(cart[i].variations){
                        line_items.push({
                            product_id: cart[i].id,
                            quantity: 1,
                    //        variations: {
                    //            //name: cart[i].variations.name,
                    //            //option: cart[i].variations.option
                    //            [cart[i].variations.name]: cart[i].variations.option
                    //}
                    });
                    }
                    else line_items.push({product_id: cart[i].id, quantity: cart[i].qty});
                }
                order.line_items = line_items;
                var data = {order: order};
                WC.api().post('orders', data, function(err, data, res){
                    var q = JSON.parse(res);

                    if(err){
                        $ionicLoading.hide();
                        $scope.showError("Error in connection. Try again.");
                        $state.go("app.checkout");
                        return false;
                    }
                    var order = JSON.parse(res).order;
                    console.log(order);
                    $localForage.removeItem(Shop.name+"-cart");
                    $localForage.removeItem(Shop.name+"-order");
                    latestOrder.data = order;
                    console.log(order);

                    //add to all orders' list
                    allOrders.data.push(order);
                    $localForage.setItem('orders',allOrders.data);
                    console.log(allOrders.data);
                    
                    //Empty the cart
                    $rootScope.cartItems = [];

                    $ionicLoading.hide();
                    $state.go('app.thanks');
                })
                
            })
        });



    }
    confirm.goBack = function(){
        $state.go('app.shippingAddress');
    }
}
