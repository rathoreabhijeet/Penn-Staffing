var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('walkthroughCtrl', function ($scope, $window, $state, $localForage, $rootScope) {

        var devH = $window.innerHeight;
        var devW = $window.innerWidth;

        var thisIsHome;
        $scope.fullDim = {'height': devH + 'px', 'width': devW + 'px'};

        $scope.goToApp = function () {
            $localForage.setItem('firstLoad', true);
            $state.go('app.' + $rootScope.thisIsHome);
        }


    })

