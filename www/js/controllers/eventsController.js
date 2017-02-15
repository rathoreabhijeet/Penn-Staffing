var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('EventsCtrl', function ($scope, MyServices, $location, $ionicLoading,
                                        $filter, EventsInfo, $state, $rootScope, $localForage) {
        addanalytics("Event page");
        // configreload.onallpage();
        $ionicLoading.show();
        $scope.pageno = 1;
        $scope.events = [];
        $scope.keepscrolling = true;
        $scope.events = EventsInfo.data;

        function fetchEventData() {
            if (EventsInfo.data.length == 0) {
                $ionicLoading.show({
                    template: '<ion-spinner class="spinner-positive"></ion-spinner>'
                });
                console.log('service empty');
                $localForage.getItem('events').then(function (data) {
                    if (data != null) {
                        console.log('forage exists');
                        console.log(data);
                        _.each(data,function(n){
                            $scope.events.push(n);
                        })
                        $ionicLoading.hide();
                    }
                    else {
                        console.log('forage no exists');
                        loadEvents();
                    }
                })
            }
            else {
                console.log('service filled');
                $ionicLoading.hide();
            }
        }

        $scope.share = function (item) {
            var data = {};
            data.startdate = $filter('date')(item.startdate, 'dd MMM, yyyy');
            data.starttime = $filter('convertto12')(item.starttime);
            data.image = $filter('serverimage')(item.image);
            window.plugins.socialsharing.share('Checkout "' + item.title + '" starting on ' + data.startdate + ', ' + data.starttime, null, data.image + 'At ' + item.venue);
        }

        function loadEvents () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });
                MyServices.getallevents(1, function (data) {
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
                    console.log($scope.events);
                    $localForage.setItem('events', $scope.events);
                    $ionicLoading.hide();
                }, function (err) {
                    $location.url("/access/offline");
                })
        }

        fetchEventData();

        $scope.geteventdetails = function (id) {
            $location.url("app/eventdetail/" + id);
        }

        $scope.footerLink = function(links){
            switch (links.linktype) {
                case '3':
                    links.typeid = links.event;
                    break;
                case '6':
                    links.typeid = links.gallery;
                    break;
                case '8':
                    links.typeid = links.video;
                    break;
                case '10':
                    links.typeid = links.blog;
                    break;
                case '2':
                    links.typeid = links.article;
                    break;
                default:
                    links.typeid = 0;

            }
            if(links.name=="Phone Call"){
                window.open('tel:' + ('+1' + $rootScope.phoneNumber), '_system');
            }
            else if (links.name == "Home") {
                $state.go("app." + $rootScope.homeLink);

            }
            else {
                $state.go("app." + links.linktypelink, {id: links.typeid, name: links.name});
            }
        }

        $scope.refreshAllData = function () {
            $scope.events.length = 0;
            loadEvents();
        }

    })
