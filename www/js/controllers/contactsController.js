var reloadpage = false;
var configreload = {};
angular.module('starter')
    .controller('ContactCtrl', function ($scope, MyServices, $location, $ionicLoading, $ionicPopup, $timeout, $compile) {
        addanalytics("Contact page");
        ;
        $scope.showloading = function () {
            $ionicLoading.show({
                template: '<ion-spinner class="spinner-positive"></ion-spinner>'
            });
            $timeout(function () {
                $ionicLoading.hide();
            }, 5000);
        };
        $scope.showloading();
        $scope.enquiry = {};
        var msgforall = function (msg) {
            $ionicLoading.hide();
            var myPopup = $ionicPopup.show({
                template: '<p class="text-center">' + msg + '</p>',
                title: 'Contact Us',
                scope: $scope,

            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 2000);

        }
        var createenquirycallback = function (data, status) {
            $ionicLoading.hide();
            if (data == 1) {
                $scope.showPopupcontact();
                $scope.enquiry = {};
            } else {
                $scope.showPopupcontactfailure();
            }
        }

        $scope.showPopupcontact = function () {
            var myPopup = $ionicPopup.show({
                template: '<p class="text-center">Successfully submitted!</p>',
                title: 'Thank you!',
                scope: $scope,
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 2000);
        };
        $scope.showPopupcontactfailure = function () {

            var myPopup = $ionicPopup.show({
                template: '<p class="text-center">Try again!</p>',
                title: 'Sorry!',
                scope: $scope,
            });
            $timeout(function () {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 2000);
        };

        $scope.enquiryform = function (enquiry) {
            $scope.allvalidation = [{
                field: $scope.enquiry.name,
                validation: ""
            }, {
                field: $scope.enquiry.email,
                validation: ""
            }, {
                field: $scope.enquiry.title,
                validation: ""
            }, {
                field: $scope.enquiry.content,
                validation: ""
            }];
            var check = formvalidation($scope.allvalidation);
            if (check) {
                MyServices.createenquiry(enquiry, createenquirycallback, function (err) {
                    $location.url("/access/offline");
                });
            } else {
                msgforall('Fill all data');
                $ionicLoading.hide();
            }

        }

        //        ***** tabchange ****

        $scope.tab = 'contactus';
        $scope.classa = 'active';
        $scope.classb = '';

        $scope.tabchange = function (tab, a) {

            $scope.tab = tab;
            if (a == 1) {
                $scope.classa = "active";
                $scope.classb = '';

            } else {
                $scope.classa = '';
                $scope.classb = "active";

            }
        };

        //    ****** End ******

    })
