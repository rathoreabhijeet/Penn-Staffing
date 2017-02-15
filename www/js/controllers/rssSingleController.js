var reloadpage = false;
var configreload = {};
angular.module('starter')

    .controller('RSSsingleCtrl', function ($scope, $stateParams, MyServices, $ionicLoading, RSS, $state, $window,
                                           $ionicSlideBoxDelegate, $ionicHistory, $timeout) {

        // $scope.loading = true;
        var devH = $window.innerHeight;
        var devW = $window.innerWidth;
        $scope.fullDim = {'height': devH + 'px', 'width': devW + 'px'};
        $scope.buttonClicked = true;
        var feedObject = {};
        var feedExists = false;
        var feedIndex;
        var prevFeedIndex = 0;
        var title;
        var name;

        $scope.blogs = [];


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

            if ($scope.buttonClicked) {
                $ionicSlideBoxDelegate.slide(feedIndex, 700);
            }
            // If this feed is not stored in service.feeds, store it
            if (_.isEmpty(RSS.feeds[feedIndex])) {
                console.log('feed not stored, storing now')
                RSS.feeds[feedIndex] = feedObject;
            }
            else {
                console.log('feed link exists');
            }

            //only the link is stored??
            if (RSS.feeds[feedIndex].feed.length == 0) {
                feedExists = false;
                console.log('feed array empty');
            }
            //Ahh, this feed already exists in service
            else {
                feedExists = true;
                console.log('Feed array filled');
                $scope.loading = false;
            }
            console.log('feedindex', feedIndex);

            //Now bind the blogs variable to appropriate service index variable
            // console.log('RSS', RSS);
            $scope.blogs[feedIndex] = RSS.feeds[feedIndex].feed;
            $timeout(function () {
                fetchBlogs();
            }, 600)
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
                                var title = '';
                                var subTitle = '';
                                if (fullTitle.indexOf('-') != -1) {
                                    n.title = fullTitle.substring(0, fullTitle.indexOf('-') - 1);
                                    n.subTitle = fullTitle.substring(fullTitle.indexOf('-') + 1);
                                }

                                $scope.blogs[feedIndex].push(n);
                            })
                            // $scope.blogs = blogsData.items;
                            // console.log($scope.blogs);
                            _.each($scope.blogs[feedIndex], function (n) {
                                console.log(n.pubDate);
                                n.pubDate = new Date(n.pubDate.replace(/\s/, 'T'))
                                console.log(n.pubDate)
                            })
                            $scope.$broadcast('AllDataLoaded');
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
            $ionicSlideBoxDelegate.enableSlide(false);
            $scope.buttonClicked = false;
        }

        function init(title, name) {
            $scope.loading = true;
            if (title && name) {
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
            $state.go('app.RSSarticle', {index: index, parent: feedIndex});
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
            if (feedIndex < RSS.data.length - 1) {
                $ionicSlideBoxDelegate.enableSlide(true);
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
                $ionicSlideBoxDelegate.enableSlide(true);
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
            // Initialize slide-box with number of slides
            console.log(RSS.data);
            _.each(RSS.data, function () {
                $scope.blogs.push([]);
                $scope.showSlider = true;
                // $ionicSlideBoxDelegate.enableSlide(true);
            });
            console.log($scope.blogs);
            $timeout(function () {
                $ionicSlideBoxDelegate.update();
                console.log($ionicSlideBoxDelegate.slidesCount());
                init();
            }, 500)
            // $ionicSlideBoxDelegate.enableSlide(false);
        };

        // $scope.nextOrPrev = function () {
        //     console.log($ionicSlideBoxDelegate.currentIndex());
        //     if (!$scope.buttonClicked) {
        //         console.log('next or prev');
        //         if (prevFeedIndex < $ionicSlideBoxDelegate.currentIndex()) {
        //             console.log('next');
        //             $scope.goToNextRSS();
        //         }
        //         else {
        //             console.log('prev');
        //             $scope.goToPreviousRSS();
        //         }
        //     }
        // }



    })
