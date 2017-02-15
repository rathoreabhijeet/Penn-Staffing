(function () {
    'use strict';

    angular
        .module('starter')
        .directive('settingsModal', settingsModalDirective);


    function settingsModalDirective($ionicModal, $state) {

        return {
            restrict: 'A',
            template: '',
            link    : function (scope, elem) {

                elem.bind('click', openModal);

                function init() {

                }

                function openModal() {

                    init();
                    $ionicModal.fromTemplateUrl('templates/ecomm/settings-modal.html', {
                        scope: scope
                    }).then(function (modal) {

                        scope.modalSetting = modal;
                        scope.modalSetting.show();

                    });

                    

                }
                scope.closeSettingModal = function () {
                    scope.modalSetting.hide();
                    scope.modalSetting.remove();
                };


            }
        };
    }


})();
