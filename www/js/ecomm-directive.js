(function () {
    'use strict';

    angular
        .module('starter')
        .directive('ecommModal', ecommModalDirective);


    function ecommModalDirective($ionicModal, $state,$rootScope) {

        return {
            restrict: 'A',
            template: '',
            link    : function (scope, elem) {

                elem.bind('click', openModal);

                function init() {

                }

                function openModal() {

                    init();
                    $ionicModal.fromTemplateUrl('templates/ecomm/ecomm-modal.html', {
                        scope: scope
                    }).then(function (modal) {

                        scope.modalEcomm = modal;
                        scope.modalEcomm.show();

                    });

                    

                }
                scope.closeEcommModal = function () {
                    scope.modalEcomm.hide();
                    scope.modalEcomm.remove();
                };

                scope.openOrders = function(){
                    scope.modalEcomm.hide();
                    scope.modalEcomm.remove();
                    $state.go('app.orders');
                }

            }
        };
    }


})();
