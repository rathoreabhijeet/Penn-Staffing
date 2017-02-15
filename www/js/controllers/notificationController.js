var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('NotificationCtrl', function ($scope, MyServices, $ionicLoading, $filter, $location, NotificationsInfo) {
        addanalytics("Notification page");
        ;
        $scope.notification = {};
        $scope.notify = [];
        $scope.pageno = 1;
        $scope.user = MyServices.getuser();
        $scope.msg = "Loading...";


        $scope.share = function (item) {
            console.log(item);
            item.image = $filter('serverimage')(item.image);
            if (item.linktype == 17) {
                item.link = item.link;
            } else {
                item.link = null;
            }
            window.plugins.socialsharing.share(item.content, null, item.image, item.link);
        }

        //	console.log(
        $scope.showloading = function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });
            $timeout(function () {
                $ionicLoading.hide();
            }, 5000);
        };
        $scope.loadnotification = function (pageno) {
            console.log($scope.notification);
            if (NotificationsInfo.data.length == 0) {
                MyServices.getNotification(pageno, function (data) {
                    console.log(data);
                    console.log(data.queryresult);
                    _.each(data.queryresult, function (n) {
                        switch (n.linktype) {
                            case '3':
                                n.tolink = n.event;
                                break;
                            case '6':
                                n.tolink = n.gallery;
                                break;
                            case '8':
                                n.tolink = n.video;
                                break;
                            case '10':
                                n.tolink = n.blog;
                                break;
                            case '2':
                                n.tolink = n.article;
                                break;
                            case '17':
                                n.tolink = n.article;
                                break;
                            default:
                                n.tolink = 0;

                        }
                        n.tolinkpath = n.linktypelink;

                        $scope.notify.push(n);
                        NotificationsInfo.data = $scope.notify;
                    });

                    if ($scope.notify.length == 0) {
                        $scope.msg = "No notifications.";
                    } else {
                        $scope.msg = "";
                    }
                    $ionicLoading.hide();
                }, function (err) {
                    $location.url("/access/offline");
                });
            }
            else {
                $scope.notify = NotificationsInfo.data;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.$broadcast('scroll.refreshComplete');
        }

        $scope.loadnotification(1);

        $scope.loadMoreNotification = function () {
            $scope.loadnotification(++$scope.pageno);
        }

        $scope.notifyclick = function (item) {
            if (item.linktype == 17) {
                window.open(item.link, '_blank', 'location=no');
            } else {
                $location.url("/app/" + item.tolinkpath + "/" + item.tolink);
            }
        }

    })
