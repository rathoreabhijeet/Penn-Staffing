var reloadpage = false;
var configreload = {};
angular.module('starter')


    .controller('Home5Ctrl', function ($scope, $window, $location, MyServices, $ionicLoading, $timeout,
                                       $sce, $ionicSlideBoxDelegate, HomePage5Info, RSS, $rootScope, $q, $http, $state) {
        var devH = $window.innerHeight;
        var devW = $window.innerWidth;
        $scope.sliderheight = {'height': 0.4 * devH + 'px'};
        $scope.fullDim = {'height': devH + 'px', 'width': devW + 'px'};
        $scope.RSSCat = {'min-height': devW / 2 + 'px'}
        $scope.loading = true;

        var loginstatus = false;
        var menu = {};
        menu.setting = false;
        $scope.slides = HomePage5Info.data;

        if (HomePage5Info.data.length == 0) {
            $scope.loading = true;
            //Home slider images data stored in service and fetched only if service is empty
            MyServices.getallsliders(function (data) {

                // console.log('service empty')
                $scope.slides = data;
                _.each($scope.slides, function (n) {
                    n.fullImageLink = adminimage + n.image;
                })
                // console.log(data);
                $ionicSlideBoxDelegate.update();
                $scope.loading = false;
            }, function (err) {
                // console.log('3');
                $location.url("/access/offline");
            });
        }
        else {
            // console.log('from service')
            // $scope.slides = HomePage5Info.data;
            $ionicSlideBoxDelegate.update();
            $scope.loading = false;
        }

        // console.log(RSS.categories);

        var promises = [];
        $scope.RSS = RSS.data;
        $scope.categories = RSS.categories;

        //RSS data stored in service and fetched only if service is empty
        if (RSS.data.length == 0) {
            // console.log('RSS service empty');
            $scope.RSS.length = 0;

            var categories = [];
            //promises array of $http requests for all RSS links to fetch RSS details
            _.each($rootScope.RSSarray, function (n) {
                promises.push($http.get($rootScope.adminurl + 'getSingleArticles?id=' + n.typeid, {withCredentials: false}))
            })

            //Data from all promises then fetched together
            $q.all(promises).then(function (data) {
                _.each(data, function (RSS) {
                    $scope.RSS.push(RSS.data);
                });
                _.each($scope.RSS, function (n, index) {
                    n.name = $rootScope.RSSarray[index].name;
                    n.typeid = $rootScope.RSSarray[index].typeid;
                    var content = n.content.replace(/<[^>]*>/g, '');
                    content = content.replace(' ', '').toLowerCase();
                    content = content.replace('nbsp', '');
                    content = content.replace(/[^a-zA-Z,]/g, "");
                    n.categories = content.split(',');
                    _.each(n.categories, function (category) {
                        categories.push(category);
                    })
                });
                var uniqArray = _.uniq(categories);
                _.each(uniqArray, function (n) {
                    $scope.categories.push(n);
                })
                // console.log($scope.categories);
                // console.log(RSS.categories);

            });
        }
        else {
            $ionicLoading.hide();
            // console.log('RSS service filled');
        }

        // console.log(RSS);
        // console.log($scope.RSS);
        // console.log($scope.categories);
        // console.log(RSS.categories);


        $scope.goToRssSingle = function (name, title) {
            // console.log(title);
            $state.go('app.RSSsingle', {name: name, title: title});
        }

    })
