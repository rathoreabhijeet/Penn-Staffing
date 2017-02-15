var reloadpage = false;
var configreload = {};
angular.module('starter')

    .controller('RSSsingleCtrl', function ($scope, $stateParams, MyServices, $ionicLoading, RSS, $state, $window,
                                           $ionicSlideBoxDelegate, $ionicHistory, $rootScope, $timeout, Config, $localForage,
                                           $ionicScrollDelegate) {

        // $scope.loading = true;
        var devH = $window.innerHeight;
        var devW = $window.innerWidth;
        $scope.fullDim = {'height': devH + 'px', 'width': devW + 'px'};

        var feedObject = {};
        var feedExists = false;
        var feedIndex;
        var prevFeedIndex=0;
        var title;
        var name;

        $scope.blogs = [];

        //Checks for URL in page title, for RSS feed
        function isURL(s) {
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            return regexp.test(s);
        }

        function setServiceObject() {
            // console.log('2');
            //Object to be stored in RSS service
            feedObject = {
                'link': $scope.rssLink,
                'feed': []
            };

            //Find the index of this RSS in RSS.data
            feedIndex = _.findIndex(RSS.data, function (o) {
                return o.title == $scope.rssLink;
            });
            prevFeedIndex = feedIndex;

            if($scope.buttonClicked) {
                $ionicSlideBoxDelegate.slide(feedIndex, 700);
            }

            // If this feed is not stored in service.feeds, store it
            if (_.isEmpty(RSS.feeds[feedIndex])) {
                console.log('feed not stored, storing now');
                RSS.feeds[feedIndex] = feedObject;
            }
            else{
                console.log('feed link exists');
            }

            //only the link is stored??
            if(RSS.feeds[feedIndex].feed.length==0){
                feedExists = false;
                console.log('feed array empty');
            }
            //Ahh, this feed already exists in service
            else{
                feedExists = true;
                console.log('Feed array filled');
            }
            console.log('feedindex', feedIndex);

            //Now bind the blogs variable to appropriate service index variable
            // console.log('RSS', RSS);
            $scope.blogs[feedIndex] = RSS.feeds[feedIndex].feed;
            $timeout(function(){
                fetchBlogs();
            },600)
        }

        function fetchBlogs() {
            // console.log('3');
            // Get the blog list so it updates automatically in service
            if (!feedExists) {
                $scope.blogs[feedIndex].length = 0;

                // API call
                MyServices.getFeedFromNewPage($scope.rssLink, function (blogsData) {
                    if (blogsData.status == 'error') {
                        $scope.msg = "Invalid RSS feed link";
                        console.log('Invalid RSS feed link');
                    }
                    else {
                        console.log(blogsData);
                        if (blogsData) {
                            $scope.msg = "";
                            _.each(blogsData.items, function (n) {
                                var fullTitle = n.title;
                                if(fullTitle.indexOf('-') != -1){
                                    n.title = fullTitle.substring(0,fullTitle.indexOf('-')-1);
                                    n.subTitle = fullTitle.substring(fullTitle.indexOf('-')+1);
                                }
                                $scope.blogs[feedIndex].push(n);
                            })
                            // $scope.blogs = blogsData.items;
                            console.log($scope.blogs);
                            _.each($scope.blogs[feedIndex], function (n) {
                                n.pubDate = new Date(n.pubDate.replace(/\s/, 'T'))
                            })
                            $scope.$broadcast('AllDataLoaded');
                            console.log($scope.blogs);
                        } else {
                            $scope.msg = "No blog data or Invalid blog";
                            console.log("No blog data or Invalid blog");
                        }
                        // console.log($ionicSlideBoxDelegate.currentIndex());
                        // console.log(RSS.feeds);
                    }
                })
            }
            else {
                // console.log($ionicSlideBoxDelegate.currentIndex());
                $ionicSlideBoxDelegate.update();
                $scope.loading = false;

                // $ionicSlideBoxDelegate.enableSlide(false);
            }
            $scope.buttonClicked = false;

        }

        function init(title, name) {
            $scope.loading = true;
            if(title && name){
                $scope.rssLink = title;
                $scope.name = name;
            }
            else {
                $scope.rssLink = $stateParams.title;
                $scope.name = $stateParams.name;
            }
            setServiceObject();
        }



        $scope.$on('AllDataLoaded', function () {
            _.each($scope.blogs[feedIndex], function (n) {
                // MyServices.getAuthorAvatar(n._links.author[0].href, function(data){
                // 	console.log(data);
                // 	console.log(data.avatar_urls['96']);
                n.formattedDate = new Date(n.pubDate);
                if (n.thumbnail == '' && typeof n.image == 'undefined') {
                    n.imageLink = getBlogImage(n.content);
                    n.imageSource = 'pickedFromHtml';
                }
                else if (typeof n.image.url != 'undefined') {
                    n.imageLink = n.image.url;
                    n.imageSource = 'imageUrl';
                }
                else {
                    n.imageLink = n.thumbnail;
                    n.imageSource = 'thumbnail';
                }
                // })
            })
            $ionicSlideBoxDelegate.update();
            $scope.loading = false;

            // $ionicSlideBoxDelegate.enableSlide(false);

        })

        $scope.goToRssArticle = function (index) {
            $state.go('app.RSSarticle', {index: index,parent:feedIndex});
        }

        var getBlogImage = function (htmlString) {
            var string1 = htmlString.substring(htmlString.indexOf('src="'), htmlString.indexOf('"', htmlString.indexOf('src="') + 5));
            var imageString = '';
            if (string1 == '') {
                imageString = 'img/menu.png';
            }
            else {
                imageString = string1.substring(5, string1.length);
            }
            return imageString;
        }

        $scope.goToNextRSS = function () {
            if (feedIndex < RSS.data.length-1) {
                // $ionicSlideBoxDelegate.enableSlide(true);
                feedIndex = feedIndex + 1;
                title = RSS.data[feedIndex].title;
                name = RSS.data[feedIndex].name;
                // console.log(title, name);
                init(title, name);
                // $ionicSlideBoxDelegate.next(700);
            }
            else {
                //toast
                console.log('no more slides');
            }
        };

        $scope.goToPreviousRSS = function () {
            if (feedIndex > 0) {
                // $ionicSlideBoxDelegate.enableSlide(true);
                feedIndex = feedIndex - 1;
                title = RSS.data[feedIndex].title;
                name = RSS.data[feedIndex].name;
                // console.log(title, name);
                init(title, name);
                // $ionicSlideBoxDelegate.previous(700);
            }
            else {
                //toast
                console.log('no more slides');
            }
        };

        $scope.lockSlide = function () {
            console.log('lockslide');
            // Initialize slide-box with number of slides
            _.each(RSS.data, function () {
                $scope.blogs.push([]);
                // $ionicSlideBoxDelegate.enableSlide(true);
            });
            $ionicSlideBoxDelegate.update();
            $timeout(function(){
                console.log($ionicSlideBoxDelegate.slidesCount());
                init();
            },100)
            // $ionicSlideBoxDelegate.enableSlide(false);
        };

        $scope.nextOrPrev = function(){
            $ionicScrollDelegate.$getByHandle('main').scrollTop();
            if(!$scope.buttonClicked) {
                console.log('next or prev');
                if (prevFeedIndex < $ionicSlideBoxDelegate.currentIndex()) {
                    $scope.goToNextRSS();
                }
                else {
                    $scope.goToPreviousRSS();
                }
            }
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

        function checkRefresh(){
            var index = _.findIndex($rootScope.RSSarray,function(n){
                return n.articlename ==$stateParams.title;
            })

            if(index == -1){
                $ionicHistory.backView().stateParams = {trigger:false};
                $ionicHistory.goBack();
            }
            else{
                RSS.feeds[feedIndex].feed.length=0;
                init(RSS.data[feedIndex].title,RSS.data[feedIndex].name);
            }
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

            checkRefresh();
        }

        $scope.fetchConfigData = function() {
            $rootScope.RSSarray = [];
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


    })
