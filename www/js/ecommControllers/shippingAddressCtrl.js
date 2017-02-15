angular.module('starter')

    .controller('shippingAddressCtrl',shippingAddressCtrl)
function shippingAddressCtrl($q, $window,$scope, $state,$ionicModal, $rootScope,$ionicLoading,$timeout,
                             $localForage,Shop,AuthService,WC,$http) {
    var shippingAddress = this;
    $scope.ship={};
    console.log("shippingAddress Ctrl is working");
    $scope.ship = {
        first_name: '',
        last_name: '',
        email: '',
        country: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        postcode: ''
    };

    $scope.billing = {
        phone: '',
        email: ''
    };

    $scope.tmp = {
        note: '',
        country: ''
    };

    $scope.user = {
        id: AuthService.id(),
        username: AuthService.username(),
        email: AuthService.email(),
        name: AuthService.name(),
        isLogin: AuthService.isAuthenticated()
    };
    console.log($scope.user);
    if($scope.user.isLogin){
        $ionicLoading.show();
        WC.api().get('customers/'+$scope.user.id, function(err, data, res){
            if(err) console.log(err);
            var user = JSON.parse(res).customer;
            console.log(user);
            $scope.billing = {
                first_name  : (user.billing_address.first_name ? user.billing_address.first_name : ''),
                last_name   : (user.billing_address.last_name ? user.billing_address.last_name : ''),
                email       : $scope.user.email,
                phone       : (user.billing_address.phone ? user.billing_address.phone : ''),
                country     : (user.billing_address.country ? user.billing_address.country : ''),
                address_1   : (user.billing_address.address_1 ? user.billing_address.address_1 : ''),
                address_2   : (user.billing_address.address_2 ? user.billing_address.address_2 : ''),
                city        : (user.billing_address.city ? user.billing_address.city : ''),
                state       : (user.billing_address.state ? user.billing_address.state : ''),
                postcode    : (user.billing_address.postcode ? user.billing_address.postcode : '')
            };

            $scope.ship = {
                first_name  : (user.shipping_address.first_name ? user.shipping_address.first_name : ''),
                last_name   : (user.shipping_address.last_name ? user.shipping_address.last_name : ''),
                country     : (user.shipping_address.country ? user.shipping_address.country : ''),
                address_1   : (user.shipping_address.address_1 ? user.shipping_address.address_1 : ''),
                address_2   : (user.shipping_address.address_2 ? user.shipping_address.address_2 : ''),
                city        : (user.shipping_address.city ? user.shipping_address.city : ''),
                state       : (user.shipping_address.state ? user.shipping_address.state : ''),
                postcode    : (user.shipping_address.postcode ? user.shipping_address.postcode : '')
            };

            if($scope.ship.country){
                $scope.tmp.country = 'loading country ...'
                $http.get("https://api.theprintful.com/countries").success(function(x){
                    var tmp = x.result;
                    for(var i in tmp){
                        if(tmp[i].code==$scope.ship.country)
                            $scope.tmp.country = tmp[i].name
                    }
                    console.log($scope.tmp.country);
                    $ionicLoading.hide();
                }).error(function(err){ $scope.tmp.country = ''; });
            }

            $ionicLoading.hide();
        })
    }

    shippingAddress.submitDetails = function(){
        console.log($scope.ship);
        $scope.order = {
            //payment_details  : $scope.payment_details,
            shipping_address   : $scope.ship,
            //billing_address  : $scope.billing,
            //shipping_lines   : $scope.shipping_lines,
            customer_id      : $scope.user.id
            //note             : $scope.tmp.note
        }
        var LOCAL_TOKEN_KEY = Shop.name+"-order";
        $localForage.setItem(LOCAL_TOKEN_KEY, $scope.order);
        $state.go('app.confirm');
    }

    //shippingAddress.goBack = function(){
    //    $state.go('app.ecommproduct');
    //    $scope.cartModal.show();
    //
    //}

}
