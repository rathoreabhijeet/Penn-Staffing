angular.module('starter')

    .controller('orderDetailCtrl', orderDetailCtrl)
function orderDetailCtrl($window, $state, allOrders, $rootScope, $stateParams) {
    var orderDetail = this;
    //-------------------------DESIGN CALCULATION START-------------------------//
    var devHeight = $window.innerHeight;
    var devWidth = $window.innerWidth;
    
    //-------------------------DESIGN CALCULATION END-------------------------//

    orderDetail.order = allOrders.data[$stateParams.id];
    
}
