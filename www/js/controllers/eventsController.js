var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('EventsCtrl', function ($scope, MyServices, $location, $ionicLoading, $filter, EventsInfo) {
        addanalytics("Event page");
        ;
        $ionicLoading.show();
        $scope.pageno = 1;
        $scope.events = [];
        $scope.keepscrolling = true;
        $scope.msg = "Loading....";
        // $scope.showloading = function () {
        //     $ionicLoading.show({
        //         template: '<ion-spinner class="spinner-positive"></ion-spinner>'
        //     });
        //     $timeout(function () {
        //         $ionicLoading.hide();
        //     }, 5000);
        // };

        $scope.share = function (item) {
            var data = {};
            data.startdate = $filter('date')(item.startdate, 'dd MMM, yyyy');
            data.starttime = $filter('convertto12')(item.starttime);
            data.image = $filter('serverimage')(item.image);
            window.plugins.socialsharing.share('Checkout "' + item.title + '" starting on ' + data.startdate + ', ' + data.starttime, null, data.image + 'At ' + item.venue);
        }

        $scope.loadevents = function (pageno) {
            if (EventsInfo.data.length == 0) {
                MyServices.getallevents(pageno, function (data) {
                    $ionicLoading.hide();
                    _.each(data.queryresult, function (n) {
                        $scope.events.push(n);
                    });

                    if ($scope.events.length == 0) {
                        $scope.msg = "No data found.";
                    } else {
                        $scope.msg = "";
                    }

                    if (data.queryresult.length == 0) {
                        $scope.keepscrolling = false;
                    }
                    EventsInfo.data = $scope.events;
                    console.log($scope.events);
                    $ionicLoading.hide();
                }, function (err) {
                    $location.url("/access/offline");
                })
            }
            else {
                $scope.events = EventsInfo.data;
                $ionicLoading.hide();
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.$broadcast('scroll.refreshComplete');
        }

        $scope.loadevents(1);

        $scope.loadMorePolls = function () {
            $scope.loadevents(++$scope.pageno);
        }

        $scope.geteventdetails = function (id) {
            $location.url("app/eventdetail/" + id);
        }

    })
