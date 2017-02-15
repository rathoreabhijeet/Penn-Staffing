var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('BlogDetailCtrl', function ($scope, MyServices, $ionicLoading, $stateParams, $timeout) {

        ;
        $ionicLoading.hide();
        $scope.msg = "Loading....";
        var getsingleblogsuccess = function (data, status) {
            console.log(data);
            $ionicLoading.hide();
            $scope.showcmsdetail = true;
            $scope.details = data;
            addanalytics(data.title);
            if (data == '') {
                $scope.msg = "No such blog";
                console.log("no such blog");
            } else {
                $scope.msg = "";
                console.log('else')
            }
        }

        $scope.id = $stateParams.id;

        $scope.showloading = function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });
            $timeout(function () {
                $ionicLoading.hide();
            }, 5000);
        };
        $scope.showloading();

        // tumblr and wordpress
        if ($stateParams.id == 0) {
            console.log('param 0');
            $scope.msg = "";
            $ionicLoading.hide();
            $scope.details = $.jStorage.get('postdetail');
            console.log($scope.details);
            console.log(typeof $scope.details.pubDate);
            $scope.blogDate = new Date($scope.details.pubDate);
            // MyServices.getHeaderImage($scope.details._links["wp:featuredmedia"][0].href, function(data){
            // 	console.log(data);
            // 	console.log(data.media_details.sizes.medium_large.source_url);
            // 	$scope.details.headerImage = data.media_details.sizes.medium_large.source_url;
            // })
            addanalytics("tumblr wordpress blog" + $scope.details.album);
            if ($scope.details.provider == 'tumblr') {
                console.log('1');
                var newdt = $scope.details.date.split('T');
                $scope.details.date = newdt[0];
            }
        } else {
            MyServices.getsingleblog($scope.id, getsingleblogsuccess, function (err) {
                console.log('2');
                $location.url("/access/offline");
            });
        }
    })
