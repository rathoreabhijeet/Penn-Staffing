var reloadpage = false;
var configreload = {};
angular.module('starter')

    .controller('ArticleCtrl', function ($scope, MyServices, ArticlesInfo, $stateParams,
                                         $ionicPopup, $interval, $location, $window, $ionicLoading, $timeout) {

        var isUrl = function (s) {
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            return regexp.test(s);
        }
        configreload.onallpage();
        $scope.article = {};
        $scope.msg = "";
        $scope.singlePage = true;
        $scope.showloading = function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });
            // $timeout(function () {
            //     $ionicLoading.hide();
            // }, 5000);
        };
        $scope.showloading();
        MyServices.getarticle($stateParams.id, function (data) {
            console.log('data');
            console.log(data);
            if (isUrl(data.title)) {
                $scope.singlePage = false;
                $scope.article.title = $stateParams.name;
                console.log('title', $scope.article.title);
                console.log('valid url');
                var loadBlogs = function () {
                    addanalytics("Wordpress self blog");
                    MyServices.getFeedFromNewPage(data.title, function (blogsData) {
                        $ionicLoading.hide();
                        if (blogsData.status == 'error') {
                            $scope.msg = "Invalid RSS feed link";
                            console.log('Invalid RSS feed link')
                        }
                        else {
                            console.log(blogsData);
                            if (blogsData) {
                                $scope.msg = "";
                                $scope.blogs = blogsData.items;
                                console.log($scope.blogs);
                                $scope.$broadcast('AllDataLoaded');
                            } else {
                                $scope.msg = "No blog data or Invalid blog";
                                console.log("No blog data or Invalid blog");
                            }
                            console.log($scope.blogs);
                            console.log(blogsData);
                        }

                    })
                }
                loadBlogs();
            }
            else if (data.title == "Return Policy") {
                $scope.article = data;
                $ionicLoading.hide();
            }
            else {
                $scope.singlePage = true;
                console.log(data.title);
                $ionicLoading.hide();
                if (_.isEmpty(ArticlesInfo.data[$stateParams.id].data)) {
                    $scope.article = data;
                    if (data == '') {
                        $scope.msg = "Blank Article.";
                    }
                    addanalytics(data.title);
                    ArticlesInfo.data[$stateParams.id].data = $scope.article;
                    $ionicLoading.hide();
                }
                else {
                    $scope.article = ArticlesInfo.data[$stateParams.id].data;
                    $ionicLoading.hide();
                }
            }
        }, function (err) {
            $location.url("/access/offline");
        });

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

        $scope.blogDetail = function (blog, name) {
            console.log(name);
            $ionicLoading.show();
            blog.provider = name;
            $.jStorage.set('postdetail', blog);
            console.log(blog);

            $location.path('/app/blogdetail/0');

        }

    })
