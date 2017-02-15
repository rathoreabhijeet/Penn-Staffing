var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('RSSarticleCtrl', function ($scope, $stateParams, MyServices, $ionicLoading, RSS, $state, $ionicHistory) {
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

            console.log($scope.article);
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


    })
