var reloadpage = false;
var configreload = {};
angular.module('starter')

    .controller('Home99Ctrl', function ($scope, $window, $location, MyServices, $ionicLoading, $timeout,
                                        $sce, $ionicSlideBoxDelegate, HomePage5Info, RSS, $rootScope, $q,
                                        $http, $state, Banner, HeaderLogo, Footer) {
       console.log('home99');
        var devH = $window.innerHeight;
        var devW = $window.innerWidth;
        $scope.sliderheight = {'height': 0.44 * devH + 'px'};
        $scope.fullDim = {'height': devH + 'px', 'width': devW + 'px'};
        $scope.RSSCat = {'min-height': devW / 2 + 'px'};
        $scope.promo_banner = {'height': 0.15 * devH + 'px'};

        $scope.loading = true;


        Banner.getAllPromotions().then(function(data){
            $scope.banners = data;
            console.log($scope.banners);
            _.each($scope.banners,function(n) {
                switch (n.linktype) {
                    case '3':
                        n.typeid = n.event;
                        break;
                    case '6':
                        n.typeid = n.gallery;
                        break;
                    case '8':
                        n.typeid = n.video;
                        break;
                    case '10':
                        n.typeid = n.blog;
                        break;
                    case '2':
                        n.typeid = n.article;
                        break;
                    default:
                        n.typeid = 0;
                }
                if (n.linktypelink == 'home') {
                    n.linktypelink = $rootScope.thisIsHome;
                }
            })

            $ionicSlideBoxDelegate.$getByHandle('promotion').update();
        });


        var loginstatus = false;
        var menu = {};
        menu.setting = false;
        // if($rootScope.staging) {
        //      adminimage = "http://business.staging.appturemarket.com/uploads/";
        // }
        // else{
        //     adminimage = "http://business.appturemarket.com/uploads/";
        // }
        $scope.slides = HomePage5Info.data;

        if (HomePage5Info.data.length == 0) {
            $scope.loading = true;


            //Home slider images data stored in service and fetched only if service is empty
            MyServices.getallsliders(function (data) {

                // console.log('service empty')
                $scope.slides = data;
                // _.each($scope.slides.menu, function (n) {
                //     n.fullImageLink = adminimage + n.image;
                // })
                console.log(data);
                _.each($scope.slides.menu,function(n){
                    switch (n.linktype) {
                        case '3':
                            n.typeid = n.event;
                            break;
                        case '6':
                            n.typeid = n.gallery;
                            break;
                        case '8':
                            n.typeid = n.video;
                            break;
                        case '10':
                            n.typeid = n.blog;
                            break;
                        case '2':
                            n.typeid = n.article;
                            break;
                        default:
                            n.typeid = 0;
                    }
                    if(n.linktypelink=='home'){
                        n.linktypelink = $rootScope.thisIsHome;
                    }
                })

                $ionicSlideBoxDelegate.update();
                $scope.loading = false;
                console.log($scope.slides);
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
                promises.push($http.get(adminurl + 'getSingleArticles?id=' + n.typeid, {withCredentials: false}))
            })

            //Data from all promises then fetched together
            $q.all(promises).then(function (data) {
                _.each(data, function (RSS) {
                    $scope.RSS.push(RSS.data);
                    console.log($scope.RSS);
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
                $scope.categories.unshift('All');

                // console.log($scope.categories);
                // console.log(RSS.categories);

            });
        }
        else {
            $ionicLoading.hide();
            // console.log('RSS service filled');
        }

        $scope.goToRssSingle = function (name, title) {
            // console.log(title);
            $state.go('app.RSSsingle', {name: name, title: title});
        }

        HeaderLogo.getheaderlogo().then(function(data){
            console.log(data);
            $scope.headerAvailable = true;
            // $scope.headerLogo = "http://business.staging.appturemarket.com/uploads/header-logo/"+data;
        },
        function(err){
            console.log(err);
        })


        Footer.getfooterlinks().then(function(data){
            console.log(data);
            $rootScope.footerLinks = data;
        })

        $rootScope.footerLink = function(links){
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
            if(links.name=="Call Us!"){
                window.open('tel:' + ('+1' + $rootScope.phoneNumber), '_system');
            }
            else if (links.linktypename == "Home") {
                console.log($rootScope.thisIsHome);
                $state.go("app." + $rootScope.thisIsHome);
            }
            else {
                $state.go("app." + links.linktypelink, {id: links.typeid, name: links.name});
            }
        }

    });
