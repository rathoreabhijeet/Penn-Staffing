angular.module('starter')

    .controller('signupCtrl', signupCtrl)
function signupCtrl($q, $window, $state, loggedInUser, $ionicLoading, $timeout, $localForage, $scope, $http, AuthService, Shop) {
    var signup = this;

    if ($state.current.name == 'coachSidemenu.signup')
        signup.player = false;
    else
        signup.player = true;
    //-------------------------DESIGN CALCULATION START-------------------------//
    var devHeight = $window.innerHeight;
    var devWidth = $window.innerWidth;
    signup.signup = {'height': 0.08 * devHeight + 'px', 'margin-top': 0.01 * devHeight + 'px'};
    signup.logoDiv = {
        'margin-top': 0.1 * devHeight + 'px',
        'height': 0.2 * devHeight + 'px',
        'margin-bottom': 0.04 * devHeight + 'px'
    };
    signup.formDiv = {'margin-top': 0.02 * devHeight + 'px'};
    signup.fullHeight = {'height': devHeight + 'px'};
    signup.paddingHorizontal = {'padding-left': 0.1 * devWidth + 'px', 'padding-right': 0.1 * devWidth + 'px'}
    signup.joinButton = {
        'width': 100 + '%', 'margin-bottom': 0.02 * devHeight + 'px',
        'padding-left': 0.1 * devWidth + 'px', 'padding-right': 0.1 * devWidth + 'px'
    };
    signup.socialLoginButton = {'height': 0.1 * devHeight + 'px'};

    //-------------------------DESIGN CALCULATION END-------------------------//

    signup.goToLogin = function () {
        $state.go('app.login');
    }
    $scope.user = {};

    signup.newSignUp = function () {
        console.log($scope.user);
        $http.get(Shop.URL + "/api/get_nonce/?controller=user&method=register", {withCredentials: false})
            .success(function (x) {
                console.log(x)
                if (x.nonce) {
                    //console.log($scope.u);
                    console.log($scope.user);
                    $http.get(Shop.URL + "/api/user/register/?username=" + $scope.user.userName + "&nonce=" + x.nonce + "&email=" + $scope.user.email + "&first_name=" + $scope.user.firstName +
                        "&last_name=" + $scope.user.lastName + "&user_pass=" + $scope.user.password + "&insecure=cool&display_name=" + $scope.user.firstName + " " + $scope.user.lastName, {withCredentials: false})
                        .success(function (y) {
                            console.log(y);
                            console.log('signed up successfully');
                            
                                    if (y.status == 'ok') {
                                        var login = {
                                            name: $scope.user.userName,
                                            password: $scope.user.password,
                                            email: $scope.user.email
                                        }
                                        $timeout(function () {
                                            AuthService.login(login)
                                                .then(function (z) {
                                                    //$ionicLoading.hide();
                                                    console.log("login successful");
                                                    loggedInUser.data=z;
                                                    loggedInUser.data.isLogin=true;
                                                    $localForage.setItem('loggedInUser',loggedInUser.data);
                                                    $state.go('app.shippingAddress');

                                                }, function (err) {
                                                    //$ionicLoading.hide();
                                                    console.log("login fail");
                                                    console.log(err);
                                                    $scope.message = err;
                                                });
                                        }, 200);
                                    } else {
                                        //$ionicLoading.hide();
                                        console.log("in status else part status!=ok")
                                        $scope.message = y.error;
                                    }
                           

                        })
                        .error(function (err) {
                            //$ionicLoading.hide();
                            console.log($scope.user);
                            console.log(err);
                            $scope.message = err.error;
                        });
                } else {
                    //$ionicLoading.hide();
                    $scope.message = x.error;
                }
            })
            .error(function (err) {
                //$ionicLoading.hide();
                $scope.message = "Error in connection. Please try again";
            });
        //$state.go('app.category')

    }


}
