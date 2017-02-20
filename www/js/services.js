var adminbase = "http://power5.simpl.life/";
var adminimage = adminbase + "uploads/";
var adminurl = adminbase + "index.php/json/";

// var adminbaseStaging = "http://business.staging.appturemarket.com/";
// var adminimageStaging = adminbaseStaging + "uploads/";
// var adminurlStaging = adminbaseStaging + "index.php/json/";

var adminhauth = adminbase + "index.php/hauth/";
var imgpath = adminimage + "image?name=";

var foods = [];

//FOR WORDPRESS INTEGRATION
var Wordpress_UserName = "en.blog.wordpress.com";

var WORDPRESS_API_URL = 'https://public-api.wordpress.com/rest/v1.1/';
var WORDPRESS_self_API_URL = 'wp-json/wp/v2/posts';
// var RSS2JSON = '/api.json?rss_url=';
var RSS2JSON = 'http://rss2json.com/api.json?rss_url=';

//for tumblr
var Tumblr_UserName = "";
var TUBMLR_API_URL = 'http://wohlig.co.in/tumblr/?url=http://api.tumblr.com/v2/blog/' + Tumblr_UserName + '/posts';

angular.module('starter.services', [])
    .filter('capitalize', function () {
        return function (input, all) {
            return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }) : '';
        }
    })
    .filter('filterVideoByCategories', function () {
        return function (rssArray, category) {
            if (category && category!='All') {
                if (rssArray) {
                    return rssArray.filter(function (rss) {
                        if (_.indexOf(rss.categories, category) != -1)
                            return true;
                        else return false;
                    })
                }
            }
            else
                return rssArray;
        }
    })
    .factory('MyServices', function ($http, $filter) {
        return {
            all: function () {
                return chats;
            },
            remove: function (chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function (chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            },
            signup: function (signup, callback, err) {
                return $http({
                    url: adminurl + 'signUp',
                    method: "POST",
                    data: {
                        'username': signup.username,
                        'email': signup.email,
                        'password': signup.password,
                        'dob': signup.dob
                    }
                }).success(callback).error(err);
            },
            signin: function (signin, callback, err) {
                return $http({
                    url: adminurl + 'signIn',
                    method: "POST",
                    data: {
                        'username': signin.username,
                        'password': signin.password
                    }
                }).success(callback).error(err);
            },
            profilesubmit: function (profile, callback, err) {
                return $http({
                    url: adminurl + 'profileSubmit',
                    method: "POST",
                    data: {
                        'id': $.jStorage.get("user").id,
                        'name': profile.name,
                        'email': profile.email,
                        'password': profile.password,
                        'dob': profile.dob,
                        'contact': profile.contact,
                    }
                }).success(callback).error(err);
            },
            createenquiry: function (enquiry, callback, err) {
                return $http({
                    url: adminurl + 'createEnquiry',
                    method: "POST",
                    data: {
                        // 'id': $.jStorage.get("user").id,
                        'name': enquiry.name,
                        'email': enquiry.email,
                        'title': enquiry.title,
                        'content': enquiry.content
                    }
                }).success(callback).error(err);
            },
            forgotpassword: function (email, callback, err) {
                return $http.get(adminurl + 'forgotPassword?email=' + email, {
                    withCredentials: false
                }).success(callback).error(err);
            },
            getsingleevents: function (id, callback, err) {
                return $http({
                    url: adminurl + 'getSingleEvents',
                    method: "POST",
                    data: {
                        'id': id
                    }
                }).success(callback).error(err);
            },

            searchelement: function (searchelement, callback, err) {
                return $http({
                    url: adminurl + 'searchElement',
                    method: "POST",
                    data: {
                        'searchelement': searchelement
                    }
                }).success(callback).error(err);
            },
            getallvideogalleryvideo: function (id, pageno, callback, err) {
                return $http.get(adminurl + 'getAllVideoGalleryVideo?id=' + id + '&pageno=' + pageno + '&maxrow=' + 15, {
                    withCredentials: false
                }).success(callback).error(err);
            },
            getallgalleryimage: function (id, pageno, callback, err) {
                return $http.get(adminurl + 'getAllGalleryImage?id=' + id + '&pageno=' + pageno + '&maxrow=' + 15, {
                    withCredentials: false
                }).success(callback).error(err);
            },
            getsingleblog: function (id, callback, err) {
                return $http({
                    url: adminurl + 'getSingleBlog',
                    method: "POST",
                    data: {
                        'id': id
                    }
                }).success(callback).error(err);
            },
            changepassword: function (password, callback, err) {
                return $http({
                    url: adminurl + 'changePassword',
                    method: "POST",
                    data: password
                }).success(callback).error(err);
            },
            authenticate: function () {
                return $http({
                    url: adminurl + 'authenticate',
                    method: "POST"
                });
            },
            getallblog: function (pageno, callback, err) {
                return $http.get(adminurl + 'getAllBlog?pageno=' + pageno + '&maxrow=' + 15, {
                    withCredentials: false
                }).success(callback).error(err);
            },
            logout: function (callback, err) {
                $.jStorage.flush();
                return $http.get(adminurl + 'logout', {
                    withCredentials: false
                }).success(callback).error(err);
            },
            getuser: function () {
                return $.jStorage.get("user");
            },
            getallsliders: function (callback, err) {
                return $http.get(adminurl + 'getAllSliders', {
                    withCredentials: false
                }).success(callback).error(err);
            },
            getallevents: function (pageno, callback, err) {

                return $http.get(adminurl + 'getAllEvents?pageno=' + pageno + '&maxrow=' + 15, {
                    withCredentials: false
                }).success(callback).error(err);
            },
            getappconfig: function (callback, err) {
                return $http.get(adminurl + 'getAppConfig', {
                    withCredentials: false
                }).success(callback).error(err);
            },
            getallgallery: function (pageno, callback, err) {
                return $http.get(adminurl + 'getAllGallery?pageno=' + pageno + '&maxrow=' + 15, {
                    withCredentials: false
                }).success(callback).error(err);
            },
            getallvideogallery: function (pageno, callback, err) {
                return $http.get(adminurl + 'getAllVideoGallery?pageno=' + pageno + '&maxrow=' + 15, {
                    withCredentials: false
                }).success(callback).error(err);
            },
            changesetting: function (setting, callback, err) {
                return $http({
                    url: adminurl + 'changeSetting',
                    method: "POST",
                    data: {
                        id: setting.id,
                        videonotification: JSON.stringify(setting.videonotification),
                        eventnotification: JSON.stringify(setting.eventnotification),
                        blognotification: JSON.stringify(setting.blognotification),
                        photonotification: JSON.stringify(setting.photonotification)
                    }
                }).success(callback).error(err);
            },
            editprofile: function (profile, callback, err) {
                var user = _.cloneDeep(profile);
                user.dob = $filter("date")(user.dob, "yyyy-MM-dd");

                return $http({
                    url: adminurl + 'editProfile',
                    method: "POST",
                    data: user
                }).success(callback).error(err);
            },
            getWordpressPosts: function (wdp, callback) {
                var getdata = function (data, status) {
                    return $http.get(data.meta.links.posts, {
                        withCredentials: false
                    }).success(callback);
                }
                $http.get(WORDPRESS_API_URL + "sites/" + wdp, {
                    withCredentials: false
                }).success(getdata);
            },
            getWordpressSelfPosts: function (wdp, callback) {
                var pipeUrl = RSS2JSON + wdp;
                console.log(pipeUrl);
                $http.get(pipeUrl).success(callback);
            },
            getFeedFromNewPage: function (wdp, callback) {
                var pipeUrl = RSS2JSON + wdp;
                console.log(pipeUrl);
                $http.get(pipeUrl, {
                    withCredentials: false
                }).success(callback);
            },
            getAuthorAvatar: function (wdp, callback) {
                $http.get(wdp, {
                    withCredentials: false
                }).success(callback);
            },
            getHeaderImage: function (wdp, callback) {
                $http.get(wdp, {
                    withCredentials: false
                }).success(callback);
            },
            getTumblrPosts: function (tmb, callback) {
                $http.get('http://wohlig.co.in/tumblr/?url=http://api.tumblr.com/v2/blog/' + tmb + '/posts', {
                    withCredentials: false
                }).success(callback);
            },
            getNotification: function (pageno, callback, err) {
                if ($.jStorage.get("user")) {
                    var notificationres = function (data) {
                        return $http.get(adminurl + 'getAllNotification?event=' + data.eventnotification + '&blog=' + data.blognotification + '&video=' + data.videonotification + '&photo=' + data.photonotification + '&pageno=' + pageno, {
                            withCredentials: false
                        }).success(callback).error(err);
                    }

                    $http.get(adminurl + 'getSingleUserDetail?id=' + $.jStorage.get("user").id, {
                        withCredentials: false
                    }).success(notificationres);

                } else {
                    console.log("else user");
                    return $http.get(adminurl + 'getAllNotification?event=true&blog=true&video=true&photo=true&pageno=' + pageno, {
                        withCredentials: false
                    }).success(callback).error(err);
                }

            },
            getallfrontmenu: function (callback, err) {
                $http.get(adminurl + 'getAllFrontmenu', {
                    withCredentials: false
                }).success(callback).error(err);
            },
            getarticle: function (id, callback, err) {
                $http.get(adminurl + 'getSingleArticles?id=' + id, {
                    withCredentials: false
                }).success(callback).error(err);
            },
            getsingleuserdetail: function (callback, err) {
                $http.get(adminurl + 'getSingleUserDetail?id=' + $.jStorage.get("user").id, {
                    withCredentials: false
                }).success(callback).error(err);
            },
            gethomecontent: function (callback, err) {
                $http.get(adminurl + 'getSingleArticles?id=1', {
                    withCredentials: false
                }).success(callback).error(err);
            },
            setconfigdata: function (data) {
                $.jStorage.set("configdata", data);
            },
            getconfigdata: function (data) {
                return $.jStorage.get("configdata");
            },
            setNotificationToken: function (callback) {
                $http.get(adminurl + 'setNotificationToken?os=' + $.jStorage.get("os") + "&token=" + $.jStorage.get("token"), {
                    withCredentials: false
                }).success(callback);
            },
        };
    })
    .factory("Blogs", function () {
        return {blogs: [], blogType: []};
    })
    .factory("HomePageInfo", function () {
        return {data: [], content: {}};
    })
    .factory("HomePage5Info", function () {
        return {data: [], promos: [], content: {}};
    })
    .factory("EventsInfo", function () {
        return {data: []};
    })
    .factory("ImagesInfo", function () {
        return {data: [], imagesData:[]};
    })
    .factory("VideosInfo", function () {
        return {data: [], videosData:[]};
    })
    .factory("ArticlesInfo", function () {
        return {data: []};
    })
    .factory("NotificationsInfo", function () {
        return {data: []};
    })
    .factory("Config", function () {
        return {data: []};
    })
    .factory("RSS", function () {
        return {menuData: [], data: [], feeds: [], categories: []};
    })
    .factory("MenuData", function () {
        return {data: []};
    })
    .factory('rssService', function ($http, $q) {

        var entries;

        return {

            getEntries: function (url) {
                var deferred = $q.defer();
                console.log('getEntries for ' + url);
                if (entries) {
                    console.log('from cache');
                    deferred.resolve(entries);
                } else {
                    var pipeUrl = RSS2JSON + url;

                    $http.get(pipeUrl).then(function (results) {
                        entries = results.data.query.results.item;
                        console.dir(entries);
                        deferred.resolve(entries);
                    });
                }
                return deferred.promise;
            }

        };
    })
    .factory('Banner', function ($http, $q, $rootScope) {

        var entries = [];

        return {

            getAllPromotions: function (url) {
                var deferred = $q.defer();
                if (entries.length != 0) {
                    console.log('from cache');
                    deferred.resolve(entries);
                } else {

                    // if($rootScope.staging) {
                    //     var pipeUrl = adminurlStaging + 'getAllPromotions';
                    //     console.log('staging');
                    // }
                    // else{
                    var pipeUrl = adminurl + 'getAllPromotions';
                    // console.log('no staging');
                    // }
                    $http.get(pipeUrl, {
                        withCredentials: false
                    }).then(function (results) {
                        console.log(results);
                        // _.each(results.data.menu, function (n) {
                        //     entries.push(n.image);
                        // });
                        // console.log(entries);
                        deferred.resolve(results.data.menu);
                    });
                }
                return deferred.promise;
            }

        };
    })
    .factory('HeaderLogo', function ($http, $q, $rootScope) {

        var headerLogo;
        return {
            getheaderlogo: function () {
                var deferred = $q.defer();
                // if($rootScope.staging) {
                //     var pipeUrl = adminurlStaging + 'getAppConfig';
                // }
                // else{
                var pipeUrl = adminurl + 'getAppConfig';
                // }

                $http.get(pipeUrl, {
                    withCredentials: false
                }).then(function (results) {
                    console.log(results);
                    headerLogo = (_.find(results.data, function (n) {
                        return n.title == "Header Logo";
                    })).image;
                    $rootScope.phoneNumber = (_.find(results.data, function (n) {
                        return n.title == "Contact No";
                    })).content;
                    console.log(headerLogo);
                    $rootScope.headerLogo = "http://power5.simpl.life/uploads/header-logo/" + headerLogo;

                    deferred.resolve("success");
                });
                return deferred.promise;
            }

        };
    })

    .factory('Footer', function ($http, $q, $rootScope) {

        return {
            getfooterlinks: function () {
                var deferred = $q.defer();
                // if($rootScope.staging) {
                //     var pipeUrl = adminurlStaging + 'getAllFootermenu';
                // }
                // else{
                var pipeUrl = adminurl + 'getAllFootermenu';
                // }

                $http.get(pipeUrl, {
                    withCredentials: false
                }).then(function (results) {
                    console.log(results);
                    deferred.resolve(results.data.menu);
                });
                return deferred.promise;
            }

        };
    })
