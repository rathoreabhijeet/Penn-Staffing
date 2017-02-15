angular.module('starter')


    .controller('EcommShopCtrl', function($scope, $stateParams, ShopService, $ionicHistory, WooCategories, $ionicSlideBoxDelegate) {
        var page = 1;
        $scope.hasMoreProducts = true;
        $scope.showLoading();
        $scope.products = [];
        $scope.showProducts = [];
        $scope.loading=true;
        $scope.category = $stateParams.category;
        var devHeight = window.innerHeight;
        $scope.sliderHeight = {'min-height':devHeight-148+'px'};
        var parent_categorie = $stateParams.parent;

        var categoryIndex = _.findIndex(WooCategories.main,function(n){
            return n.name == $scope.category;
        })
        console.log(categoryIndex);
        _.each(WooCategories.main,function(){
            $scope.products.push([]);
        })

        WooCategories.main[categoryIndex].products = $scope.products[categoryIndex];
        console.log($scope.products);

        $scope.loading = true;
        ShopService.getData(1, $stateParams.category)
            .then(function(data) {
                _.each(data,function(n){
                    $scope.products[categoryIndex].push(n);
                })
                $scope.loading = false;
                $ionicSlideBoxDelegate.slide(categoryIndex, 700);
                $scope.hideLoading();
            }, function(error) {
                $scope.loading = false;
                $scope.hideLoading();
                $scope.notification(config.messages.server);
            });
        console.log(WooCategories);

        $scope.goToNextCategory = function(){
            if(categoryIndex<$scope.products.length-1) {
                $ionicSlideBoxDelegate.enableSlide(true);
                categoryIndex = categoryIndex + 1;
                $scope.category = WooCategories.main[categoryIndex].name;
                console.log($scope.category);
                if($scope.products[categoryIndex].length==0) {
                    $scope.loading = true;
                    $scope.showLoading();
                    $ionicSlideBoxDelegate.slide(categoryIndex, 700);
                    ShopService.getData(1, $scope.category)
                        .then(function (data) {
                            _.each(data, function (n) {
                                $scope.products[categoryIndex].push(n);
                            });
                            $scope.loading = false;
                            console.log($scope.products);
                            $scope.hideLoading();
                        }, function (error) {
                            $scope.loading = false;
                            $scope.hideLoading();
                            $scope.notification(config.messages.server);
                        });
                }
                else{
                    console.log('loading data from services');
                    $ionicSlideBoxDelegate.slide(categoryIndex, 700);
                }

            }
            $ionicSlideBoxDelegate.enableSlide(false);
        }

        $scope.goToPreviousCategory = function(){
            if(categoryIndex>0) {
                $ionicSlideBoxDelegate.enableSlide(true);
                categoryIndex = categoryIndex - 1;
                $scope.category = WooCategories.main[categoryIndex].name;
                console.log($scope.category);
                if($scope.products[categoryIndex].length==0) {
                    $scope.loading = true;
                    $scope.showLoading();
                    $ionicSlideBoxDelegate.slide(categoryIndex, 700);
                    ShopService.getData(1, $scope.category)
                        .then(function (data) {
                            _.each(data, function (n) {
                                $scope.products[categoryIndex].push(n);
                            });
                            $scope.loading = false;
                            console.log($scope.products);
                            $scope.hideLoading();
                        }, function (error) {
                            $scope.loading = false;
                            $scope.hideLoading();
                            $scope.notification(config.messages.server);
                        });
                }
                else{
                    console.log('loading data from services');
                    $ionicSlideBoxDelegate.slide(categoryIndex, 700);
                }
            }
            $ionicSlideBoxDelegate.enableSlide(false);

        }

        
        /* Load More Products */
        $scope.loadMorProducts = function() {
            page++;
            ShopService.getData(page, $stateParams.category)
                .then(function(data) {
                    if(data.length > 0) {
                        for(i=0; i<data.products.length; i++) {
                            $scope.products.push(data.products[i]);
                        }
                    }
                    else $scope.hasMoreProducts = false;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, function(error) {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }

        /* Refresh Products List */
        $scope.refreshProducts = function() {
            page = 1;
            $scope.hasMoreProducts = true;
            ShopService.getData(1, $stateParams.category)
                .then(function(data) {
                    $scope.products = data.products;
                    $scope.$broadcast('scroll.refreshComplete');
                }, function(error) {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }

        $scope.goBack = function(){
            $ionicHistory.goBack();
        }

    })
