var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('RSSCtrl', function ($scope, $rootScope, MyServices, $window, $q, $http, $state, RSS, $ionicLoading, $timeout) {
        // console.log(RSS);
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-positive"></ion-spinner>'
        });
        var devWidth = $window.innerWidth;
        $scope.RSSCat = {'min-height': devWidth / 2 + 'px'}

        var promises = [];
        $scope.RSS = RSS.data;
        $scope.categories = RSS.categories;

        if (RSS.data.length == 0) {
            // console.log('rss service empty')
            $scope.RSS.length = 0;

            var categories = [];

            _.each($rootScope.RSSarray, function (n) {
                promises.push($http.get($rootScope.adminurl + 'getSingleArticles?id=' + n.typeid, {withCredentials: false}))
            })

            $q.all(promises).then(function (data) {
                // console.log('all promise return');
                //Save all data in RSS.data
                _.each(data, function (RSS) {
                    $scope.RSS.push(RSS.data);
                    // console.log($scope.RSS);
                });

                //Create RSS.feed property with empty array for full length
                _.each($scope.RSS, function () {
                    RSS.feeds.push({});
                    // console.log('RSS', RSS);
                })

                //Get the categories of each RSS feed, make a unique array of all categories
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
                $scope.categories.unshift('All');

                // console.log($scope.categories);
                // console.log(RSS.categories);
                $ionicLoading.hide();
                $scope.selectedCategory = $scope.categories[0];
                $timeout(function(){
                    $scope.selectedCategory = $scope.categories[0];
                },10)

            });
        }
        else {
            // console.log('rss service filled')
            $timeout(function(){
                $scope.selectedCategory = $scope.categories[0];
            },10)
            $ionicLoading.hide();
        }

        // console.log(RSS.data);

        $scope.changeCategory = function (category) {
            $scope.selectedCategory = category;
        }

        $scope.goToRssSingle = function (name, title) {
            // console.log(title);
            $state.go('app.RSSsingle', {name: name, title: title});
        }

    })
