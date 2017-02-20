var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('OfflineCtrl', function ($scope, $state, $rootScope, $ionicLoading, $cordovaToast, $cordovaNetwork) {
        addanalytics("Offline page");
        $ionicLoading.hide();

        $scope.goHome = function () {
            if ($cordovaNetwork.isOnline()) {
                $state.go('app.' + $rootScope.thisIsHome);
            }
            else{
                $cordovaToast.showShortCenter('Device offline.');
            }
        }


    })

