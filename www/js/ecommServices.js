angular.module('starter')

/*  ==== Categories Service ====
 *   Return all categories
 */
.factory('CategoriesService', function($q, $http) {
    var getData = function() {
        var deferred = $q.defer();
        var request = generateRequest('GET', 'products/categories', false, false);
        console.log(request);
        request = request+'&per_page=100';
        console.log('before request');
        $http.get(request, {
            withCredentials: false,
        timeout: config.timeout})
            .success(function(json){
                console.log(json);
                deferred.resolve(json);
            })
            .error(function(error){
                //alert('error');
                console.log(error);
                deferred.reject();
            })
        console.log('after request');

        return deferred.promise;
    };

    return {
        getData: getData
    }
})
    .factory('UserService', function($q, $http) {
        var createUser = function(user) {
            var deferred = $q.defer();
            var request = generateRequest('POST', 'customers', false, false);
            console.log(request);
            console.log(user);
            var customer = {
                email: user.email,
                first_name: user.firstName,
                last_name: user.lastName,
                username: user.userName,
                password:user.password,
                billing: {
                    first_name: user.firstName,
                    last_name: user.lastName,
                    company: '',
                    address_1: '',
                    address_2: '',
                    city: '',
                    state: '',
                    postcode: '',
                    country: '',
                    email: user.email,
                    phone: ''
                },
                shipping: {
                    first_name: user.firstName,
                    last_name: user.lastName,
                    company: '',
                    address_1: '',
                    address_2: '',
                    city: '',
                    state: '',
                    postcode: '',
                    country: ''
                }
            };
            // request = request+'&per_page=100';
            console.log('before request');
            $http.post(request,customer)
                .success(function(json){
                    deferred.resolve(json);
                    console.log('after request');
                })
                .error(function(error){
                    //alert('error');
                    console.log(error);
                    deferred.reject();
                    console.log('after request');
                })

            return deferred.promise;
        };

        return {
            createUser: createUser
        }
    })
/*  ==== Shop Service ====
 *   Return all products
 */
    .factory('ShopService', function($q, $http) {
        var getData = function(page, category) {
            var deferred = $q.defer();

            if(category) {
                var request = generateRequest('GET', 'products', page, category);
                request = request + '&page='+page+'&filter[product_cat]='+encodeURIComponent(category);
            }
            else {
                var request = generateRequest('GET', 'products', page, false);
                request = request+'&page='+page;
            }
            $http.get(request, {timeout: config.timeout,
                withCredentials: false
            })
                .success(function(json, status, headers, config){
                    deferred.resolve(json);
                })
                .error(function(error){
                    deferred.reject();
                })


            return deferred.promise;
        };

        return {
            getData: getData
        }
    })


    /*  ==== Product Service ====
     *   Return a product
     */
    .factory('ProductService', function($q, $http) {
        var getData = function(id) {
            var deferred = $q.defer();

            var request = generateRequest('GET', 'products/'+id, false, false);
            $http.get(request, {timeout: config.timeout,
                withCredentials: false
            })
                .success(function(json){
                    deferred.resolve(json);
                })
                .error(function(error){
                    deferred.reject();
                })

            return deferred.promise;
        };

        return {
            getData: getData
        }
    })