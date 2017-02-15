angular.module('starter')
    .filter('convertto12', function () {
        return function (date) {
            var newtime = "";
            if (date) {
                var split = date.split(":");
                if (parseInt(split[0]) >= 12) {
                    newtime = (parseInt(split[0]) - 12) + ":" + split[1] + " PM onwards .";
                } else {
                    newtime = split[0] + ":" + split[1] + " AM onwards .";
                }
                return newtime;
            }
        };
    })

    .filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;
            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    })

    .filter('cuthtml', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;
            value = value.rendered.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    })

    .filter('rawHtml', ['$sce',
        function ($sce) {
            return function (val) {
                return $sce.trustAsHtml(val);
            };
        }
    ])

    .filter('formatdate', function ($filter) {
        return function (val) {
            var splitval = val.toString().split(" ");
            return $filter('date')(splitval[0], 'dd MMMM, yyyy')
        };
    })

    .filter('noappid', function () {
        return function (val) {
            var val = val.replace("appid", "");
            return val;
        };
    })

    .filter('url', function ($filter) {
        return function (val) {
            if (val) {
                var splitval = val.split(",");
                return splitval[0];
            }
        };
    })


    .filter('serverimage', function () {
        return function (image) {
            if (image && image != null) {
                var start = image.substr(0, 4);

                if (start == "http") {
                    return image;
                }
                
                return adminimage + image;

            } else {
                return undefined;
            }
        };
    })
    // .filter('serverimagestaging', function ($rootScope) {
    //     return function (image) {
    //         if (image && image != null) {
    //             var start = image.substr(0, 4);
    //
    //             if (start == "http") {
    //                 return image;
    //             }
    //
    //             if ($rootScope.staging) {
    //                 return adminimageStaging + image;
    //             }
    //             else {
    //                 return adminimage + image;
    //             }
    //         } else {
    //             return undefined;
    //         }
    //     };
    // })
    .filter('profileimg', function () {
        return function (image) {
            if (image && image != null) {
                var start = image.substr(0, 4);

                if (start == "http") {
                    return image;
                }

                return adminimage + image;
            } else {
                return "img/user.jpg";
            }
        };
    })