var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('RSSCtrl', function ($scope, $rootScope, MyServices, $window, $q, $http, $state, RSS, $ionicLoading,
                                     $timeout, $localForage, Config) {
        // console.log(RSS);
        $ionicLoading.show({
            template: '<ion-spinner class="spinner-positive"></ion-spinner>'
        });
        var devWidth = $window.innerWidth;
        $scope.RSSCat = {'min-height': devWidth / 2 + 'px'}

        var promises = [];
        var categories = [];
        $scope.RSS = RSS.data;
        $scope.categories = RSS.categories;

        //Checks for URL in page title, for RSS feed
        function isURL(s) {
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            return regexp.test(s);
        }

        function fetchRssData(){
            $ionicLoading.show();
            $scope.RSS.length = 0;

            var categories = [];

            _.each($rootScope.RSSarray, function (n) {
                promises.push($http.get($rootScope.adminurl + 'getSingleArticles?id=' + n.typeid, {withCredentials: false}))
            })

            $q.all(promises).then(function (data) {

                //Save all data in RSS.data
                _.each(data, function (singleRSS) {
                    $scope.RSS.push(singleRSS.data);
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
                // console.log($scope.RSS);
                $localForage.setItem('rssData', $scope.RSS);
                $localForage.getItem('rssData').then(function(data){
                    // console.log(data);
                });
                $scope.RSSLoading = false;
                $ionicLoading.hide();
            });
        }
        
        function sortRssLinks(data) {
            $scope.menudata = [];

            // console.log(data);
            _.each(data.menu, function (n, index) {
                if (n.linktypelink != "setting" && n.linktypelink != "contact" && n.linktypelink != "profile") {
                    var newmenu = {};
                    newmenu.id = n.id;
                    newmenu.name = n.name;

                    newmenu.order = n.order;
                    newmenu.icon = n.icon;
                    newmenu.link_type = n.linktypename;
                    newmenu.articlename = n.articlename;
                    switch (n.linktype) {
                        case '3':
                            newmenu.typeid = n.event;
                            break;
                        case '6':
                            newmenu.typeid = n.gallery;
                            break;
                        case '8':
                            newmenu.typeid = n.video;
                            break;
                        case '10':
                            newmenu.typeid = n.blog;
                            break;
                        case '2':
                            newmenu.typeid = n.article;
                            break;
                        default:
                            newmenu.typeid = 0;
                    }
                    newmenu.link = n.linktypelink;
                    // $rootScope.homeName = 'Home';

                    //If there is URL in page name, it means it contains RSS feed links
                    if (n.linktypename == "Pages" && isURL(n.articlename)) {
                        $rootScope.RSSarray.push(newmenu);
                    }
                    console.log($rootScope.RSSarray);
                }
            });
            fetchRssData();
        }

        function fetchConfigData() {
            MyServices.getallfrontmenu(function (data) {
                MyServices.setconfigdata(data);
                Config.data = data;
                console.log(data);
                $localForage.setItem('config', data);

                sortRssLinks(data);
            }, function (err) {
                $state.go('access.offline');
            })
        }

        console.log(RSS.data);
        //Checking if RSS service contains any data
        if (RSS.data.length == 0) {
            //RSS service is empty
            fetchRssData();
            if(categories.length>2 && categories[1].trim()!=''){
                $scope.showCategoryBar = true;
            }
        }
        else {
            console.log('rss service filled');
            if(categories.length>2 && categories[1].trim()!=''){
                $scope.showCategoryBar = true;
            }
            $timeout(function(){
                $scope.selectedCategory = $scope.categories[0];
            },10)
            $ionicLoading.hide();
        }
        
        $scope.refreshAllRSS = function(){
            $scope.categories.length=0;
            RSS.feeds.length = 0;
            promises = [];
            categories = [];
            fetchRssData();
            if(categories.length>2 && categories[1].trim()!=''){
                $scope.showCategoryBar = true;
            }
            console.log(RSS);
        }

        // console.log(RSS.data);

        $scope.changeCategory = function (category) {
            $scope.selectedCategory = category;
            console.log($scope.selectedCategory);
        }

        $scope.goToRssSingle = function (name, title) {
            // console.log(title);
            $state.go('app.RSSsingle', {name: name, title: title});
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

            $localForage.setItem('rssData', null);
            $scope.RSS.length = 0;
            $scope.categories.length = 0;
            $rootScope.RSSarray = [];
            promises = [];
            categories = [];
            fetchConfigData();
        }

    })
