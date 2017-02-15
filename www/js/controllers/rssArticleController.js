var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('RSSarticleCtrl', function ($scope, $stateParams, MyServices, $ionicLoading,
                                            RSS, $state, $ionicHistory, $rootScope, $ionicScrollDelegate) {
        // console.log(RSS);
        var article = parseInt($stateParams.index);
        var feed = parseInt($stateParams.parent);

        $scope.name = RSS.data[$stateParams.parent].name;
        $scope.totalArticles = RSS.feeds[feed].feed.length;
        $scope.currentArticle = article+1;
        // var link = $stateParams.link;

        // var feedIndex = _.findIndex(RSS.feeds, function (o) {
        //     return o.link == link;
        // });

        function fetchArticle(feedIndex,articleIndex) {
            // console.log(RSS);
            // console.log(typeof feedIndex, feedIndex);
            // console.log(typeof articleIndex, articleIndex);
            $scope.article = RSS.feeds[feedIndex].feed[articleIndex];

            var loopRemoveDuplicateImage = true;

            // console.log($scope.article);
            function removeDuplicateImage() {
                var htmlString = $scope.article.content;
                var string1 = htmlString.substring(htmlString.indexOf('src="'), htmlString.indexOf('"', htmlString.indexOf('src="') + 5));
                var imageString = string1.substring(5, string1.length);
                if (imageString == $scope.article.imageLink) {
                    var nextImage = htmlString.substring(htmlString.indexOf('<img'), htmlString.indexOf('>', htmlString.indexOf('<img') + 5) + 1);
                    $scope.article.content = $scope.article.content.replace(nextImage, '');
                }
                else {
                    loopRemoveDuplicateImage = false;
                }
            }

            while (loopRemoveDuplicateImage) {
                removeDuplicateImage();
            }
        }

        $scope.goToPreviousArticle=function(){
            if(article>0) {
                article = article - 1;
                fetchArticle(feed, article);
                $scope.currentArticle = $scope.currentArticle -1;
                $ionicScrollDelegate.$getByHandle('article').scrollTop();
            }
            else{
                console.log('no more slides');
            }
        }

        $scope.goToNextArticle=function(){
            if(article<RSS.feeds[feed].feed.length-1) {
                article = article + 1;
                fetchArticle(feed, article);
                $scope.currentArticle = $scope.currentArticle +1;
                $ionicScrollDelegate.$getByHandle('article').scrollTop();
            }
            else{
                console.log('no more slides');
            }
        }

        // $scope.backToParentRSS = function () {
        //     $ionicHistory.backView().stateParams = {name: $stateParams.name, title: $stateParams.link};
        //     $ionicHistory.goBack();
        // }
        fetchArticle(feed,article);

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

    })
