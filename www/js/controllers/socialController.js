var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('SocialCtrl', function ($scope,$window, MyServices, $state) {
        addanalytics("Social page");
        // configreload.onallpage();
        $scope.tab = 'fb';
        $scope.social = {};
        $scope.showsocial = {};
        var devWidth = $window.innerWidth;
        $scope.RSSCat = {'min-height': devWidth / 2 + 'px'}
        
        $scope.go = function () {
            console.log("demo demo");
        }

        console.log(MyServices.getconfigdata());
        $scope.config = MyServices.getconfigdata().config;
        if ($scope.config[6]) {
            $scope.social = JSON.parse($scope.config[6].text);
            $scope.social = _.filter($scope.social, function (n) {
                return n.value != ""
            });
        }

        _.each($scope.social,function(n){
            switch(n.name){
                case 'facebookappid':
                    n.image = 'img/social/facebook.jpg';
                    break;
                case 'twitterappid':
                    n.image = 'img/social/twitter.jpg';
                    break;
                case 'tumblrappid':
                    n.image = 'img/social/tumblr.jpg';
                    break;
                case 'youtubeappid':
                    n.image = 'img/social/youtube.jpg';
                    break;
                case 'googleplusappid':
                    n.image = 'img/social/googleplus.jpg';
                    break;
                case 'instagramappid':
                    n.image = 'img/social/instagram.jpg';
                    break;
            }
        })
        // $scope.social = _.chunk($scope.social, 2);
        console.log($scope.social);

        $scope.goSocial = function (link) {
            console.log(link);
            console.log("dfasdf");
            if (typeof cordova != 'undefined') {
                cordova.InAppBrowser.open(link, '_blank', 'location=yes');
                console.log(link);
            } else {
                window.open(link, "_blank");
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

    })
