var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('OfflineCtrl', function ($scope, $ionicLoading, $state, $rootScope, $cordovaNetwork, $cordovaToast) {
        addanalytics("Offline page");
        $ionicLoading.hide();
        
        $scope.goHome = function () {
            if ($cordovaNetwork.isOnline()) {
                $state.go('app.landing');
            }
            else{
                $cordovaToast.showShortCenter('Device offline.');
            }
        }
    })

