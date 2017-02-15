angular.module('starter')

    .controller('thanksCtrl',thanksCtrl)
function thanksCtrl($q, $window, $state, $rootScope,$ionicLoading,$timeout,latestOrder) {
    var thanks = this;

    console.log("thanks Ctrl is working");

    thanks.goHome = function(){
        $state.go("app." + $rootScope.thisIsHome);
    }
    
    thanks.data=latestOrder.data;
    
}
