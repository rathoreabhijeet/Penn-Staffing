var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('BlogsCtrl', function ($scope, MyServices, $location, $ionicLoading, Blogs, $state, $rootScope) {
        ;
        $scope.blogs = Blogs.blogs;
        console.dir($state.current)

        if (_.indexOf(Blogs.blogType, "wordpressself") != -1) {
            $scope.showWordpressSelf = true;
            $ionicLoading.hide();
        }

        var name = $rootScope.clickedMenuItem.toLowerCase();

        $scope.pageno = 1;
        $scope.keepscrolling = true;
        $scope.msg = "Loading...";
        // loader

        $scope.getblogdetailscms = function (id) {
            $location.path('/app/blogdetail/' + id);
        }
        function showloading() {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });
            // $timeout(function () {
            // 	$ionicLoading.hide();
            // }, 5000);
        };

        $scope.blogDetail = function (blog, name) {
            console.log(name);
            $ionicLoading.show();
            blog.provider = name;
            $.jStorage.set('postdetail', blog);
            console.log(blog);
            if (name == "cms") {
                $location.path('/app/blogdetail/' + blog.id);
            } else {
                $location.path('/app/blogdetail/0');
            }
        }

        $scope.reloadblog = function (page) {
            MyServices.getallblog(page, function (data, status) {
                // console.log(data);
                $ionicLoading.hide();
                _.each(data.queryresult, function (n) {
                    // console.log(n);
                    $scope.blogs.push(n);
                });

                if (data.queryresult.length == 0) {
                    $scope.keepscrolling = false;
                }
                if ($scope.blogs.length != 0) {
                    $scope.msg = "";
                } else {
                    $scope.msg = "No data found";
                }
            }, function (err) {
                $location.url("/access/offline");
            });
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.$broadcast('scroll.refreshComplete');
        }


        var loadBlogs = function () {
            addanalytics("Wordpress self blog");
            $scope.showWordpressSelf = true;
            Blogs.blogType.push('wordpressself');
            $scope.keepscrolling = false;
            Wordpress_UserName = $.jStorage.get("blogType").appid;
            console.log($.jStorage.get("blogType").appid);
            MyServices.getWordpressSelfPosts($.jStorage.get("blogType").appid, function (data, status) {
                console.log($.jStorage.get("blogType").appid);
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                if (data) {
                    $scope.msg = "";
                    $scope.blogs = data.items;
                } else {
                    $scope.msg = "No blog data or Invalid blog";
                }
                console.log(data);
                console.log($scope.blogs);
                var i = 0;
                // _.each($scope.blogs, function (n) {
                // 	n.content = n.description;
                // 	i++;
                // 	if (i == $scope.blogs.length) {
                Blogs.blogs = $scope.blogs;
                // console.log(Blogs);
                $scope.$broadcast('AllDataLoaded');
                // }
                // });
            })
        }

        console.log('blog name', $.jStorage.get("blogType").name);

        if ($.jStorage.get("blogType") && $.jStorage.get("blogType").name.toLowerCase() == "wordpress") {
            addanalytics("Wordpress blog");
            $scope.showWordpress = true;
            $scope.keepscrolling = false;
            Wordpress_UserName = $.jStorage.get("blogType").appid;
            MyServices.getWordpressPosts($.jStorage.get("blogType").appid, function (data, status) {
                $ionicLoading.hide();
                $scope.blogs = data.posts;
            });
        } else if ($.jStorage.get("blogType") && $.jStorage.get("blogType").name.toLowerCase() == "tumblr") {
            addanalytics("Tumblr Blog");
            $scope.showTumblr = true;
            $scope.keepscrolling = false;
            Tumblr_UserName = $.jStorage.get("blogType").appid;
            MyServices.getTumblrPosts($.jStorage.get("blogType").appid, function (data, status) {

                $ionicLoading.hide();
                if (data) {
                    $scope.msg = "";
                    $scope.blogs = data.response.posts;
                } else {
                    $scope.msg = "No blog data or Invalid blog";
                }
            });
        } else if ($.jStorage.get("blogType") && $.jStorage.get("blogType").name.toLowerCase() == "cms") {
            addanalytics("Custom blog");
            $scope.showCustomblog = true;
            $scope.reloadblog(1);
        } else if ($.jStorage.get("blogType") && $.jStorage.get("blogType").name.toLowerCase() == "wordpressself") {
            if (Blogs.blogs.length == 0) {
                $ionicLoading.show();
                loadBlogs();
            }
            else {
                $scope.msg = "";
                // $scope.blogs = Blogs.blogs;
            }
        }

        $scope.$on('AllDataLoaded', function () {
            _.each($scope.blogs, function (n) {
                // MyServices.getAuthorAvatar(n._links.author[0].href, function(data){
                // 	console.log(data);
                // 	console.log(data.avatar_urls['96']);
                n.formattedDate = new Date(n.pubDate);
                if (n.thumbnail == '' && typeof n.image == 'undefined') {
                    n.imageLink = 'img/menu.png';
                    n.imageSource = 'default';
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
            console.log($scope.blogs);
        })

        $scope.loadMorePolls = function () {
            $scope.reloadblog(++$scope.pageno);
        }

        $scope.doRefresh = function () {
            Blogs.blogs = [];
            Blogs.blogType = [];
            loadBlogs();
        }

    })
