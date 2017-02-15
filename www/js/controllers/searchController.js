var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('SearchCtrl', function ($scope, MyServices, $location, $ionicLoading, $ionicPopup, $timeout) {
        addanalytics("Search page");
        // loader
        $scope.search = {};
        $scope.search.text = "";
        ;

        $scope.showloading = function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });
            $timeout(function () {
                $ionicLoading.hide();
            }, 5000);
        };
        $scope.searchresults = [];

        var searchelementcallback = function (data, status) {
            console.log(data);
            $scope.searchresults.searchevent = data.events;
            $scope.searchresults.searchgallery = data.gallery;
            $scope.searchresults.searchvideogallery = data.videogallery;
            $scope.searchresults.blog = data.blog;
            $scope.searchresults.article = data.article;
        }
        $scope.getsearchelement = function (searchelement) {
            $timeout(function () {
                MyServices.searchelement(searchelement, searchelementcallback, function (err) {
                    $location.url("/access/offline");
                });
            }, 2000)

        }

        // Go to Events page
        $scope.openevents = function (id) {
            $location.url("/app/eventdetail/" + id);
        }
        $scope.openvideogallery = function (id) {
            $location.url("/app/videogallery/" + id);
        }
        $scope.opengallery = function (id) {
            $location.url("/app/photogallery/" + id);
        }
        $scope.openblog = function (id) {
            console.log(id);
            $location.url("/app/blogdetail/" + id);
        }
        $scope.openarticle = function (id) {
            $location.url("/app/article/" + id);
        }
        $scope.clear = function () {
            $scope.search.text = "";
            $scope.searchresults = [];
        }

    });