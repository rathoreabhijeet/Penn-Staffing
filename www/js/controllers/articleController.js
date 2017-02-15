var reloadpage = false;
var configreload = {};
angular.module('starter')

    .controller('ArticleCtrl', function ($scope, MyServices, ArticlesInfo, $stateParams,
                                         $ionicPopup, $interval, $location, $window, $ionicLoading, $state, $rootScope, $localForage) {

        var isUrl = function (s) {
            var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
            return regexp.test(s);
        }

        function getMeta(url) {
            var img = new Image();
            img.addEventListener("load", function () {
                console.log('asda');
                alert(this.naturalWidth + ' ' + this.naturalHeight);
            });
            img.src = url;
        }

        var devheight = $window.innerHeight;
        // configreload.onallpage();
        $scope.article = {};
        $scope.msg = "";
        $scope.singlePage = true;
        $scope.articleImage = {'min-height': 0.35 * devheight + 'px'};
        $scope.showloading = function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });
            // $timeout(function () {
            //     $ionicLoading.hide();
            // }, 5000);
        };
        $scope.showloading();
        // console.log($stateParams.id);

        function checkForageForArticle() {
            console.log('checking forage');
            $localForage.getItem('articles').then(function (forageData) {
                if (forageData != null) {
                    console.log('forage data exists');
                    console.log(forageData);
                    var articleIndex = _.findIndex(forageData, function (n) {
                        return n.typeid == $stateParams.id;
                    });
                    if (articleIndex != -1) {
                        console.log('current article exists in forage');
                        $scope.article = forageData[articleIndex].data;

                        //adding to service
                        var articleInServiceIndex = _.findIndex(ArticlesInfo.data, function (n) {
                            return n.typeid == $stateParams.id;
                        });
                        ArticlesInfo.data[articleInServiceIndex].data = $scope.article;
                        $ionicLoading.hide();
                    }
                    else {
                        console.log('current article doesnt exist in forage');
                        getArticleFromId(1);
                    }
                }
                else {
                    console.log('forage data doesnt exist');
                    getArticleFromId(2);
                }
            })
        }

        if (isUrl($stateParams.articleName)) {
            // console.log('is url');
        }
        else {
            console.log('is not url');
            var articleIndex = _.findIndex(ArticlesInfo.data, function (n) {
                return (n.typeid == $stateParams.id) && n.data;
            });
            if (articleIndex != -1) {
                console.log('exists in service');
                $scope.article = ArticlesInfo.data[articleIndex].data;
                if ($scope.article.data == '') {
                    $scope.msg = "Blank Article.";
                }
                $ionicLoading.hide();
            }
            else {
                console.log('doesnt exist in service');
                checkForageForArticle();
                // getArticleFromId();
            }
        }

        function getArticleFromId(index) {
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
                                // console.log(blogsData);
                                if (blogsData) {
                                    $scope.msg = "";
                                    $scope.blogs = blogsData.items;
                                    // console.log($scope.blogs);
                                    $scope.$broadcast('AllDataLoaded');
                                } else {
                                    $scope.msg = "No blog data or Invalid blog";
                                    // console.log("No blog data or Invalid blog");
                                }
                                // console.log($scope.blogs);
                                // console.log(blogsData);
                            }

                        })
                    }
                    loadBlogs();
                }
                else {
                    $scope.singlePage = true;
                    console.log(data.title);
                    $ionicLoading.hide();
                    console.log(ArticlesInfo);
                    console.log($stateParams.id);
                    var articleIndex = _.findIndex(ArticlesInfo.data, function (n) {
                        return n.typeid == $stateParams.id;
                    });

                    $scope.article = data;
                    // if (data == '') {
                    //     $scope.msg = "Blank Article.";
                    // }
                    // addanalytics(data.title);
                    ArticlesInfo.data[articleIndex].data = $scope.article;
                    $ionicLoading.hide();
                    if(index==1){
                        $localForage.getItem('articles').then(function (forageData) {
                            forageData.push(ArticlesInfo.data[articleIndex]);
                            $localForage.setItem('articles',storeArray);
                            // console.log('item saved in existing local forage');
                            $localForage.getItem('articles').then(function(data){
                                // console.log(data);
                            })
                        })
                    }
                    if(index==2){
                        var storeArray =[];
                        storeArray.push(ArticlesInfo.data[articleIndex]);
                        $localForage.setItem('articles',storeArray);
                        // console.log('item saved in new local forage');
                        $localForage.getItem('articles').then(function(data){
                            // console.log(data);
                        })
                    }
                    // console.log(ArticlesInfo.data);

                }
            }, function (err) {
                $location.url("/access/offline");
            });
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
            getMeta($scope.article.image);
            // console.log($scope.blogs);
        })

        $scope.blogDetail = function (blog, name) {
            // console.log(name);
            $ionicLoading.show();
            blog.provider = name;
            $.jStorage.set('postdetail', blog);
            // console.log(blog);

            $location.path('/app/blogdetail/0');

        }

        $scope.footerLink = function (links) {
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
            if (links.name == "Phone Call") {
                window.open('tel:' + ('+1' + $rootScope.phoneNumber), '_system');
            }
            else if (links.name == "Home") {
                $state.go("app." + $rootScope.homeLink);
            }
            else {
                $state.go("app." + links.linktypelink, {id: links.typeid, name: links.name});
            }
        }

    })
