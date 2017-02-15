angular.module('starter')
    .controller('EcommProductCtrl', function($scope, $stateParams, $ionicSlideBoxDelegate, ProductService, $ionicHistory) {
        var product_id = $stateParams.id;
        $scope.finishedLoading = false;
        $scope.showLoading();
        ProductService.getData(product_id)
            .then(function(data) {
                $scope.product = data;
                $scope.changePrice($scope.product);
                if($scope.product.on_sale) {
                    if ($scope.product.regular_price % 1 == 0) $scope.product.regular_price = $scope.product.regular_price+'.00';
                }

                /* Select attributes */
                $scope.attributesList = [];
                if($scope.product.attributes.length <= 0) $scope.notSelected = false;
                $scope.changeAttribute = function(attribute) {
                    $scope.product.selectedAttrs = $scope.attributesList;
                }
                $scope.initAttrs = function(attrName, firstOption) {
                    $scope.attributesList[attrName] = firstOption;
                    $scope.product.selectedAttrs = $scope.attributesList;
                }
                /* End Select attributes */
                $scope.finishedLoading = true;
                $scope.hideLoading();
                $ionicSlideBoxDelegate.update();
            }, function(error) {
                $scope.notification(config.messages.server);
            });
        $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
            $ionicSlideBoxDelegate.update();
        });
        $scope.goBack = function(){
            $ionicHistory.goBack();
        }

    })
