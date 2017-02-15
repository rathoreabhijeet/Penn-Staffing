angular.module('starter')

    .controller('loginCtrl', loginCtrl)
function loginCtrl($window, $state, $rootScope, $localForage, $stateParams,
                   $ionicLoading, $timeout, $q,AuthService,$scope, loggedInUser) {
    var login = this;
    console.log($state.current.name)
    //-------------------------DESIGN CALCULATION START-------------------------//
    var devHeight = $window.innerHeight;
    var devWidth = $window.innerWidth;

    login.logoDiv = {
        'margin-top': 0.04 * devHeight + 'px',
        'height': 0.2 * devHeight + 'px',
        'margin-bottom': 0.03 * devHeight + 'px'
    };
    login.formDiv = {'margin-top': 0.01 * devHeight + 'px'};
    login.fullHeight = {'height': devHeight + 'px'};
    login.forgotDiv = {'width': 100 + '%'};
    login.forgotMargin = {'margin-top': 0.01 * devHeight + 'px'};
    login.signup = {'margin-top': 0.01 * devHeight + 'px'};
    login.username = {'margin-bottom': 0.01 * devHeight + 'px'};
    login.socialLoginButton = {'height': 0.1 * devHeight + 'px'};
    login.paddingHorizontal = {'padding-left':0.1*devWidth+'px','padding-right':0.1*devWidth+'px'}

    //-------------------------DESIGN CALCULATION END-------------------------//


    login.goToSignup = function (param) {
        $state.go('app.signup');
    }
    $rootScope.user = {};
    login.UserSignin = function(){
        //console.log($scope.user);
        console.log($rootScope.user);
            AuthService.login($rootScope.user).then(function (x) {
                console.log(x);
                loggedInUser.data = x;
                console.log(loggedInUser);

                //save in local forage
                loggedInUser.data.isLogin=true;
                $localForage.setItem('loggedInUser', loggedInUser.data);
                console.log("successfully login");

                if ($stateParams.prevState) {
                    $state.go('app.' + $stateParams.prevState);
                }
                else {
                    $state.go('app.shippingAddress');
                }
            }, function (err) {
                console.log(err);
                $scope.message = err;
            });
        //$state.go('app.category');
    }

    // login.UserAutoSignin = function(){
    //     //console.log($scope.user);
    //     console.log($rootScope.user);
    //     var isLoggedIn = AuthService.loadUserCredentials();
    //     if(!isLoggedIn) {
    //         console.log('user not logged in');
    //     }
    //     else{
    //         if ($stateParams.prevState) {
    //             loggedInUser.data.isLogin=true;
    //             $localForage.setItem('loggedInUser', loggedInUser);
    //             $state.go('app.' + $stateParams.prevState);
    //             console.log('to prev state');
    //         }
    //         else {
    //             loggedInUser.data.isLogin=true;
    //             $localForage.setItem('loggedInUser', loggedInUser);
    //             $state.go('app.shippingAddress');
    //             console.log('to shipping');
    //         }
    //     }
    //     //$state.go('app.category');
    // }

    // login.UserAutoSignin();


    login.googleLogin = function () {
        gmailLogin.login();
    }
}
