angular.module('starter')

    .controller('ordersCtrl', ordersCtrl)
function ordersCtrl($window, $state, allOrders, $rootScope, loggedInUser, $ionicLoading, WC) {
    var orders = this;
    console.log($state.current.name);
    //-------------------------DESIGN CALCULATION START-------------------------//
    var devHeight = $window.innerHeight;
    var devWidth = $window.innerWidth;
    
    //-------------------------DESIGN CALCULATION END-------------------------//

    orders.allOrders = allOrders.data;
    orders.user = loggedInUser.data;

    orders.doRefresh = function(){
        page = 1;
        $ionicLoading.show();
        WC.api().get('customers/'+orders.user.id+'/orders?page='+page+'&fields=id,created_at,total,line_items,status', function(err, data, res){
            if(err){
                $ionicLoading.hide();
                orders.showError("Error in connection. Please try again.");
                return false;
            }
            orders.orders = JSON.parse(res).orders;
            $ionicLoading.hide();
        })
    }
    
    console.log(orders.user);
    console.log(loggedInUser.data);
    console.log(loggedInUser.data.isLogin);
    console.log(typeof loggedInUser.data.isLogin);
    if(!loggedInUser.data.isLogin) {
        $state.go("app.login", {prevState: 'orders'});
    }
    else{
        orders.doRefresh();
    }


    orders.goToHome = function(){
        $state.go("app." + $rootScope.thisIsHome);
    }

    orders.showOrderDetail = function(index){
        $state.go("app.orderDetail",{id:index});
    }
}
